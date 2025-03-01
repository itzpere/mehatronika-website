import { getPayload } from 'payload'
import { publicDavClient } from '@/lib/utils/public-webdav'
import configPromise from '@payload-config'

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const fullMsg = `[WEBDAV-SYNC ${timestamp}] ${message}`

  if (data) {
    log(fullMsg, JSON.stringify(data))
  } else {
    log(fullMsg)
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
  // Initialize PayloadCMS client
  const payload = await getPayload({
    config: configPromise,
  })

  // Cache to prevent duplicate folder lookups
  const folderCache = new Map<string, number>()

  // Add batching and throttling
  const BATCH_SIZE = 25
  const DELAY_BETWEEN_BATCHES = 1000 // 1 second

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

  // Main sync process with batching
  //ovo nema smisla dao sam mu da radi u batches da nebi radio tolko brzo i preopteretio databazu
  // i on je odradio ceo poso 40% brze!
  // volim programiranje
  try {
    log('Started syncing files from WebDAV')
    const allFiles = await getAllFiles()
    log(`Found ${allFiles.length} files`)

    // Process folders in batches
    const folders = allFiles.filter((file) => file.type === 'directory')
    log(`Processing ${folders.length} folders in batches`)
    await processSequentially(folders, mapFolderToDatabase)
    log('Folders done')

    // Process files in batches
    const files = allFiles.filter((file) => file.type === 'file')
    log(`Processing ${files.length} files in batches`)
    await processSequentially(files, mapFilesToDatabase)
    log('Files syncing completed')

    try {
      // Handle deleted folders
      const dbFolders = await payload.find({
        collection: 'folders',
        where: {
          deleted: {
            equals: false,
          },
        },
        limit: 1000,
      })

      const webdavFolderIds = new Set(
        allFiles
          .filter((file) => file.type === 'directory' && file.props?.fileid)
          .map((file) => file.props!.fileid),
      )

      const deletedFolders = dbFolders.docs.filter((folder) => !webdavFolderIds.has(folder.uuid))
      log(`Found ${deletedFolders.length} deleted folders to mark`)

      if (deletedFolders.length > 0) {
        await processSequentially(deletedFolders, async (folder) => {
          await payload.update({
            collection: 'folders',
            id: folder.id,
            data: { deleted: true },
          })
        })
        log('Deleted folders processing complete')
      }
    } catch (error) {
      console.error('Error processing deleted folders:', error)
    }

    // After processing files and folders
    try {
      // Get all files that aren't marked as deleted
      const dbFiles = await payload.find({
        collection: 'files',
        where: {
          deleted: {
            equals: false,
          },
        },
        limit: 1000,
      })

      // Create lookup set of fileIds from WebDAV
      const webdavFileIds = new Set(
        allFiles.filter((file) => file.props?.fileid).map((file) => file.props!.fileid),
      )

      // Find files that exist in DB but not in WebDAV
      const deletedFiles = dbFiles.docs.filter((file) => !webdavFileIds.has(file.uuid))

      log(`Found ${deletedFiles.length} deleted files to mark`)

      // Mark them as deleted in batches
      if (deletedFiles.length > 0) {
        const batchSize = BATCH_SIZE * 2 // We can use larger batches for simple updates

        for (let i = 0; i < deletedFiles.length; i += batchSize) {
          const batch = deletedFiles.slice(i, i + batchSize)
          log(
            `Processing deleted batch ${i / batchSize + 1}/${Math.ceil(deletedFiles.length / batchSize)}`,
          )

          await Promise.all(
            batch.map((file) =>
              payload
                .update({
                  collection: 'files',
                  id: file.id,
                  data: { deleted: true },
                })
                .catch((err) => console.error(`Error marking file ${file.uuid} as deleted:`, err)),
            ),
          )

          // Breathing room
          if (i + batchSize < deletedFiles.length) {
            await sleep(DELAY_BETWEEN_BATCHES)
          }
        }
        log('Deleted files processing complete')
      }
    } catch (error) {
      console.error('Error processing deleted files:', error)
    }
  } catch (error) {
    console.error('Error syncing files:', error)
    throw error
  }
}
