import { getPayload } from 'payload'
import { publicDavClient } from '@/lib/utils/public-webdav'
import configPromise from '@payload-config'

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const fullMsg = `[WEBDAV-SYNC ${timestamp}] ${message}`

  if (data) {
    console.error(fullMsg, JSON.stringify(data))
  } else {
    console.error(fullMsg)
  }
}

// Interface representing WebDAV file/folder structure from server response
interface WebDAVFile {
  filename: string // Full path including filename
  basename: string // Just the filename without path
  lastmod: string // Last modification timestamp
  size: number // File size in bytes
  type: 'file' | 'directory' // Item type
  mime?: string // MIME type for files
  props?: {
    fileid?: number // Unique ID from WebDAV server
  } & { [key: string]: any } // Other WebDAV properties
}

export async function syncFilesFromWebDAV(): Promise<void> {
  const payload = await getPayload({
    config: configPromise,
  })

  const folderCache = new Map<string, number>()
  const BATCH_SIZE = 25
  const DELAY_BETWEEN_BATCHES = 1000

  // Sleep helper
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const MAX_RETRIES = 3
  const RETRY_DELAY = 2000

  // Retry wrapper function
  async function withRetry<T>(operation: () => Promise<T>, name: string): Promise<T> {
    let lastError
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        console.warn(
          `Attempt ${attempt}/${MAX_RETRIES} failed for ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
        if (attempt < MAX_RETRIES) {
          // Exponential backoff
          const delay = RETRY_DELAY * Math.pow(2, attempt - 1)
          await sleep(delay)
        }
      }
    }
    throw lastError
  }

  // Process items in batches with delay
  async function processSequentially<T>(
    items: T[],
    processFunc: (item: T) => Promise<void>,
    batchSize = BATCH_SIZE,
  ) {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`,
      )

      // Process items one by one instead of using Promise.all
      for (const item of batch) {
        try {
          await processFunc(item)
        } catch (err) {
          console.error(`Error processing item:`, err)
        }
      }

      // Give DB breathing room between batches
      if (i + batchSize < items.length) {
        await sleep(DELAY_BETWEEN_BATCHES)
      }
    }
  }

  // Get folder ID from cache or database
  async function getFolderFromCache(path: string): Promise<number> {
    if (folderCache.has(path)) {
      return folderCache.get(path)!
    }

    // Look up folder in database with retry
    const folder = await withRetry(
      () =>
        payload.find({
          collection: 'folders',
          where: { currentPath: { equals: path } },
          limit: 1000,
        }),
      `getFolderFromCache(${path})`,
    )

    const uuid = folder.docs[0]?.uuid ?? 0
    folderCache.set(path, uuid)
    return uuid
  }

  // Sync file to PayloadCMS database
  async function mapFilesToDatabase(file: WebDAVFile) {
    // Skip files without ID
    if (!file.props?.fileid) {
      console.warn(`No fileid for ${file.filename}, skipping`)
      return
    }

    try {
      // Check if file already exists
      const existing = await payload.find({
        collection: 'files',
        where: { uuid: { equals: file.props?.fileid } },
      })

      // Get parent folder ID
      const pathSegments = file.filename.split('/')
      const parentPath = pathSegments.slice(0, -1).join('/') || '/'
      const parentId = await getFolderFromCache(parentPath)

      // Prepare file data
      const fileData = {
        uuid: file.props?.fileid ?? 0,
        name: file.basename,
        currentPath: file.filename,
        parentId,
        lastModified: new Date(file.lastmod).toISOString(),
        size: file.size,
        type: file.type,
      }

      // Update or create file
      if (existing.docs.length > 0) {
        const existingDoc = existing.docs[0]
        // Skip if no changes
        if (
          existingDoc.name === fileData.name &&
          existingDoc.currentPath === fileData.currentPath &&
          existingDoc.parentId === fileData.parentId &&
          existingDoc.size === fileData.size &&
          existingDoc.lastModified === fileData.lastModified &&
          existingDoc.type === fileData.type
        ) {
          return
        }
        await payload.update({
          collection: 'files',
          where: { uuid: { equals: file.props?.fileid } },
          data: fileData,
        })
      } else {
        await payload.create({
          collection: 'files',
          data: fileData,
        })
      }
    } catch (error) {
      console.error(`Error syncing file ${file.filename}:`, error)
    }
  }

  // Similar to mapFilesToDatabase but for folders
  async function mapFolderToDatabase(file: WebDAVFile) {
    if (!file.props?.fileid) {
      console.warn(`No fileid for ${file.filename}, skipping`)
      return
    }
    try {
      const existing = await payload.find({
        collection: 'folders',
        where: {
          uuid: { equals: file.props?.fileid },
        },
        limit: 1000,
      })
      const pathSegments = file.filename.split('/')
      const parentPath = pathSegments.slice(0, -1).join('/') || '/'
      const parentId = await getFolderFromCache(parentPath)

      const folderData = {
        uuid: file.props?.fileid ?? 0,
        name: file.basename,
        currentPath: file.filename,
        parentId,
        visibility: 'public' as 'public' | 'private' | 'shared' | null,
      }

      if (existing.docs.length > 0) {
        const existingDoc = existing.docs[0]
        if (
          existingDoc.name === folderData.name &&
          existingDoc.currentPath === folderData.currentPath &&
          existingDoc.parentId === folderData.parentId &&
          existingDoc.visibility === folderData.visibility
        ) {
          return // Skip update if nothing changed
        }
        await payload.update({
          collection: 'folders',
          where: { uuid: { equals: file.props?.fileid } },
          data: folderData,
        })
      } else {
        await payload.create({
          collection: 'folders',
          data: folderData,
        })
      }
    } catch (error) {
      console.error(`Error syncing file ${file.filename}:`, error)
    }
  }

  // Recursively get all files from WebDAV
  async function getAllFiles(dirPath: string = '/'): Promise<WebDAVFile[]> {
    // Query WebDAV server with custom props
    const response = await publicDavClient.getDirectoryContents(dirPath, {
      details: true,
      data: `<?xml version="1.0" encoding="UTF-8"?>
        <d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
          <d:prop>
            <d:getlastmodified />
            <d:getcontentlength />
            <d:getcontenttype />
            <d:resourcetype />
            <oc:fileid />
            <d:displayname />
          </d:prop>
        </d:propfind>`,
    })

    let files: WebDAVFile[] = []
    const filesArray = Array.isArray(response) ? response : response.data

    // Process each item
    for (const item of filesArray) {
      // Skip current directory
      if (item.filename === dirPath) continue

      const webdavFile: WebDAVFile = { ...item }
      files.push(webdavFile)

      // Recursively get subfiles for directories
      if (item.type === 'directory') {
        const subFiles = await getAllFiles(item.filename)
        files = [...files, ...subFiles]
      }
    }

    // Filter out git files
    return files.filter((file) => !file.filename.includes('.git/'))
  }

  // New function to fetch all existing files/folders from DB
  async function fetchExistingItems() {
    const [dbFolders, dbFiles] = await Promise.all([
      payload.find({
        collection: 'folders',
        where: { deleted: { equals: false } },
        limit: 1000,
      }),
      payload.find({
        collection: 'files',
        where: { deleted: { equals: false } },
        limit: 1000,
      }),
    ])

    // Create maps for quick lookups
    const folderMap = new Map(dbFolders.docs.map((f) => [f.uuid, f]))
    const fileMap = new Map(dbFiles.docs.map((f) => [f.uuid, f]))
    const pathToFolderMap = new Map(dbFolders.docs.map((f) => [f.currentPath, f]))
    const pathToFileMap = new Map(dbFiles.docs.map((f) => [f.currentPath, f]))

    return { folderMap, fileMap, pathToFolderMap, pathToFileMap }
  }

  try {
    log('Starting optimized sync from WebDAV')

    // Set lock at the beginning
    await payload.updateGlobal({
      slug: 'syncLock',
      data: {
        isRunning: true,
        lastSync: new Date().toISOString(),
      },
    })

    // Get existing DB items and WebDAV items in parallel
    const [{ folderMap, fileMap, pathToFolderMap, pathToFileMap }, allFiles] = await Promise.all([
      fetchExistingItems(),
      getAllFiles(),
    ])

    log(`Found ${allFiles.length} files in WebDAV`)

    // Sort files into categories based on changes
    const folders = allFiles.filter((f) => f.type === 'directory' && f.props?.fileid)
    const files = allFiles.filter((f) => f.type === 'file' && f.props?.fileid)

    // Track what needs processing
    const newFolders = []
    const modifiedFolders = []
    const newFiles = []
    const modifiedFiles = []
    const webdavIdsFound = new Set<number>()

    // Identify new and modified folders
    for (const folder of folders) {
      const id = folder.props?.fileid
      if (!id) continue

      webdavIdsFound.add(id)
      const existingFolder = folderMap.get(id)

      if (!existingFolder) {
        newFolders.push(folder)
      } else {
        const pathChanged = existingFolder.currentPath !== folder.filename
        const nameChanged = existingFolder.name !== folder.basename

        if (pathChanged || nameChanged) {
          modifiedFolders.push(folder)
        }
      }
    }

    // Identify new and modified files
    for (const file of files) {
      const id = file.props?.fileid
      if (!id) continue

      webdavIdsFound.add(id)
      const existingFile = fileMap.get(id)

      if (!existingFile) {
        newFiles.push(file)
      } else {
        const pathChanged = existingFile.currentPath !== file.filename
        const sizeChanged = existingFile.size !== file.size
        const dateChanged = existingFile.lastModified !== new Date(file.lastmod).toISOString()

        if (pathChanged || sizeChanged || dateChanged) {
          modifiedFiles.push(file)
        }
      }
    }

    // Find deleted items (in DB but not in WebDAV)
    const deletedFolders = Array.from(folderMap.values()).filter(
      (folder) => !webdavIdsFound.has(folder.uuid),
    )

    const deletedFiles = Array.from(fileMap.values()).filter(
      (file) => !webdavIdsFound.has(file.uuid),
    )

    // Log stats about what needs processing
    log(`Found ${newFolders.length} new folders, ${modifiedFolders.length} modified folders`)
    log(`Found ${newFiles.length} new files, ${modifiedFiles.length} modified files`)
    log(`Found ${deletedFolders.length} deleted folders, ${deletedFiles.length} deleted files`)

    // Process changes in proper order (folders before files, etc.)
    log('Processing new folders')
    await processSequentially(newFolders, mapFolderToDatabase)

    log('Processing modified folders')
    await processSequentially(modifiedFolders, mapFolderToDatabase)

    log('Processing new files')
    await processSequentially(newFiles, mapFilesToDatabase)

    log('Processing modified files')
    await processSequentially(modifiedFiles, mapFilesToDatabase)

    // Mark deleted items
    if (deletedFolders.length) {
      log('Processing deleted folders')
      await processSequentially(deletedFolders, async (folder) => {
        await payload.update({
          collection: 'folders',
          id: folder.id,
          data: { deleted: true },
        })
      })
    }

    if (deletedFiles.length) {
      log('Processing deleted files')
      await processSequentially(deletedFiles, async (file) => {
        await payload.update({
          collection: 'files',
          id: file.id,
          data: { deleted: true },
        })
      })
    }

    log('Sync completed successfully')
  } catch (error) {
    console.error('Error syncing files:', error)
    throw error
  } finally {
    // Always release lock when done, even if there was an error
    await payload.updateGlobal({
      slug: 'syncLock',
      data: {
        isRunning: false,
      },
    })
  }
}
