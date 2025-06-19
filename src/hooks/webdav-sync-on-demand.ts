import { getPayload } from 'payload'
import { publicDavClient } from '@/lib/utils/public-webdav'
import configPromise from '@payload-config'

function log(message: string, data?: any) {
  // Skip logging in production to avoid Next.js server component issues
  if (process.env.NODE_ENV === 'production') return

  const timestamp = new Date().toISOString()
  const fullMsg = `[WEBDAV-SYNC-ONDEMAND ${timestamp}] ${message}`

  try {
    if (data) {
      console.log(fullMsg, typeof data === 'object' ? JSON.stringify(data) : data)
    } else {
      console.log(fullMsg)
    }
  } catch {
    // Fail silently if logging causes issues in server components
  }
}

// Interface representing WebDAV file/folder structure from server response
interface WebDAVFile {
  filename: string
  basename: string
  lastmod: string
  size: number
  type: 'file' | 'directory'
  mime?: string
  props?: {
    fileid?: number
  } & { [key: string]: any }
}

// Sync a specific folder and its direct contents on demand
export async function syncFolderOnDemand(folderPath: string): Promise<{
  folderUpdated: boolean
  newFolders: number
  modifiedFolders: number
  newFiles: number
  modifiedFiles: number
}> {
  const payload = await getPayload({
    config: configPromise,
  })

  const folderCache = new Map<string, number>()

  // Get folder ID from cache or database
  async function getFolderFromCache(path: string): Promise<number> {
    if (folderCache.has(path)) {
      return folderCache.get(path)!
    }

    const folder = await payload.find({
      collection: 'folders',
      where: { currentPath: { equals: path } },
      limit: 1,
    })

    const uuid = folder.docs[0]?.uuid ?? 0
    folderCache.set(path, uuid)
    return uuid
  }

  // Process folder data
  async function processFolder(file: WebDAVFile) {
    if (!file.props?.fileid) {
      log(`No fileid for folder ${file.filename}, skipping`)
      return
    }

    try {
      const existing = await payload.find({
        collection: 'folders',
        where: { uuid: { equals: file.props.fileid } },
      })

      const pathSegments = file.filename.split('/')
      const parentPath = pathSegments.slice(0, -1).join('/') || '/'
      const parentId = await getFolderFromCache(parentPath)

      const folderData = {
        uuid: file.props.fileid,
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
          return // Skip if unchanged
        }

        await payload.update({
          collection: 'folders',
          id: existingDoc.id,
          data: folderData,
        })
      } else {
        await payload.create({
          collection: 'folders',
          data: folderData,
        })
      }
    } catch (error) {
      log(`Error processing folder ${file.filename}:`, error)
    }
  }

  // Process file data
  async function processFile(file: WebDAVFile) {
    if (!file.props?.fileid) {
      log(`No fileid for file ${file.filename}, skipping`)
      return
    }

    try {
      const existing = await payload.find({
        collection: 'files',
        where: { uuid: { equals: file.props.fileid } },
      })

      const pathSegments = file.filename.split('/')
      const parentPath = pathSegments.slice(0, -1).join('/') || '/'
      const parentId = await getFolderFromCache(parentPath)

      const fileData = {
        uuid: file.props.fileid,
        name: file.basename,
        currentPath: file.filename,
        parentId,
        lastModified: new Date(file.lastmod).toISOString(),
        size: file.size,
        type: file.type,
      }

      if (existing.docs.length > 0) {
        const existingDoc = existing.docs[0]
        if (
          existingDoc.name === fileData.name &&
          existingDoc.currentPath === fileData.currentPath &&
          existingDoc.parentId === fileData.parentId &&
          existingDoc.size === fileData.size &&
          existingDoc.lastModified === fileData.lastModified &&
          existingDoc.type === fileData.type
        ) {
          return // Skip if unchanged
        }

        await payload.update({
          collection: 'files',
          id: existingDoc.id,
          data: fileData,
        })
      } else {
        await payload.create({
          collection: 'files',
          data: fileData,
        })
      }
    } catch (error) {
      log(`Error processing file ${file.filename}:`, error)
    }
  }

  try {
    log(`Starting on-demand sync for folder: ${folderPath}`)

    // Check for trailing slash and normalize
    const normalizedPath =
      folderPath.endsWith('/') && folderPath !== '/' ? folderPath.slice(0, -1) : folderPath

    // Get the folder itself and its direct contents (not recursive)
    const response = await publicDavClient.getDirectoryContents(normalizedPath, {
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
      deep: false, // Only direct children
    })

    // Process response
    const filesArray = Array.isArray(response) ? response : response.data

    // Find the current folder in the response
    const currentFolderItem = filesArray.find(
      (item) => item.filename === normalizedPath || item.filename === `${normalizedPath}/`,
    )

    // Get direct children (exclude current folder itself)
    const children = filesArray.filter(
      (item) => item.filename !== normalizedPath && item.filename !== `${normalizedPath}/`,
    )

    // Filter out git files
    const filteredChildren = children.filter((file) => !file.filename.includes('.git/'))

    // Fetch existing DB items for this folder and its children
    const [currentFolderInDb, foldersInDb, filesInDb] = await Promise.all([
      currentFolderItem?.props?.fileid
        ? payload.find({
            collection: 'folders',
            where: { uuid: { equals: currentFolderItem.props.fileid } },
          })
        : { docs: [] },
      payload.find({
        collection: 'folders',
        where: {
          currentPath: {
            like: normalizedPath === '/' ? '/[^/]*$' : `${normalizedPath}/[^/]*$`,
          },
          deleted: { equals: false },
        },
      }),
      payload.find({
        collection: 'files',
        where: {
          currentPath: {
            like: normalizedPath === '/' ? '/[^/]*$' : `${normalizedPath}/[^/]*$`,
          },
          deleted: { equals: false },
        },
      }),
    ])

    // Create maps for quick lookups
    const folderMap = new Map(foldersInDb.docs.map((f) => [f.uuid, f]))
    const fileMap = new Map(filesInDb.docs.map((f) => [f.uuid, f]))

    // Process the current folder first
    let folderUpdated = false
    if (currentFolderItem?.props?.fileid) {
      if (currentFolderInDb.docs.length > 0) {
        folderCache.set(normalizedPath, currentFolderInDb.docs[0].uuid)
        folderUpdated = true
      }

      await processFolder(currentFolderItem)
    }

    // Categorize items for processing
    const childFolders = filteredChildren.filter((f) => f.type === 'directory' && f.props?.fileid)
    const childFiles = filteredChildren.filter((f) => f.type === 'file' && f.props?.fileid)

    // Track changes
    const webdavIdsFound = new Set<number>()
    const newFolders = []
    const modifiedFolders = []
    const newFiles = []
    const modifiedFiles = []

    // Identify changes in folders
    for (const folder of childFolders) {
      const id = folder.props?.fileid as number
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

    // Identify changes in files
    for (const file of childFiles) {
      const id = file.props?.fileid as number
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

    // Process all changes
    for (const folder of newFolders) {
      await processFolder(folder)
    }

    for (const folder of modifiedFolders) {
      await processFolder(folder)
    }

    for (const file of newFiles) {
      await processFile(file)
    }

    for (const file of modifiedFiles) {
      await processFile(file)
    }

    log(`Folder sync completed for ${folderPath}`)

    return {
      folderUpdated,
      newFolders: newFolders.length,
      modifiedFolders: modifiedFolders.length,
      newFiles: newFiles.length,
      modifiedFiles: modifiedFiles.length,
    }
  } catch (error) {
    log(`Error during on-demand sync of folder ${folderPath}:`, error)
    throw error
  }
}
