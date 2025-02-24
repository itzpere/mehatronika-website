import { getPayload } from 'payload'
import { publicDavClient } from '@/lib/utils/public-webdav'
import configPromise from '@payload-config'

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

  // Get folder ID from cache or database
  async function getFolderFromCache(path: string): Promise<number> {
    if (folderCache.has(path)) {
      return folderCache.get(path)!
    }

    // Look up folder in database
    const folder = await payload.find({
      collection: 'folders',
      where: { currentPath: { equals: path } },
    })
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

  // Main sync process
  try {
    console.log('Started syncing files from WebDAV')
    const allFiles = await getAllFiles()
    console.log(`Found ${allFiles.length} files`)

    // Process folders first to ensure parent folders exist
    for (const file of allFiles) {
      if (file.type === 'directory') {
        console.log('folder:', file.filename)
        await mapFolderToDatabase(file)
      }
    }
    console.log('folders done')

    // Then process files
    for (const file of allFiles) {
      if (file.type === 'file') {
        console.log('file:', file.filename)
        await mapFilesToDatabase(file)
      }
    }
    console.log('Files syncing completed')
  } catch (error) {
    console.error('Error syncing files:', error)
    throw error
  }
}
