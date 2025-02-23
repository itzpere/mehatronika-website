import { getPayload } from 'payload'
import { WebDAVClient } from 'webdav'
import { publicDavClient } from '@/lib/utils/public-webdav'
import configPromise from '@payload-config'
import { mdFileInfo } from './top-md-files'

interface WebDAVProps {
  getlastmodified: string
  getcontentlength: string
  getcontenttype: string
  resourcetype: { collection?: unknown }
  getetag: string
  fileid: number
  tags: string
  displayname: string
}

export interface FileStat {
  filename: string
  basename: string
  type: 'directory' | 'file'
  size: number
  lastmod: string
  etag: string | null
  mime?: string
  props: WebDAVProps
}

const payload = await getPayload({
  config: configPromise,
})

export const getWebDAVClient = (): WebDAVClient => {
  // Remove the bind and handle 'this' context inside the function
  const originalGetDirectoryContents = publicDavClient.getDirectoryContents

  publicDavClient.getDirectoryContents = async (path: string, options?: any) => {
    try {
      const response = await originalGetDirectoryContents.call(publicDavClient, path, options)

      // Check if response is an array directly
      const responseData = Array.isArray(response) ? response : response?.data

      if (!responseData) {
        throw new Error('Invalid response format')
      }

      const files = responseData.map((file: any) => ({
        filename: file.filename,
        basename: file.basename,
        type: file.type,
        size: file.size,
        lastmod: file.lastmod,
        etag: file.etag,
        mime: file.mime,
        props: {
          getlastmodified: file.props?.getlastmodified || '',
          getcontentlength: file.props?.getcontentlength || '',
          getcontenttype: file.props?.getcontenttype || '',
          resourcetype: file.props?.resourcetype || {},
          getetag: file.props?.getetag || '',
          fileid: file.props?.fileid ? Number(file.props.fileid) : null,
          tags: file.props?.tags || '',
          displayname: file.props?.displayname || '',
        },
      }))

      return files
    } catch (error) {
      console.error(`Failed to get directory contents for path: ${path}`, error)
      throw error
    }
  }

  return publicDavClient
}

export const getFileId = (file: FileStat): number | null => {
  return file.props?.fileid || null
}

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export async function createFileInDB(file: FileStat) {
  const fileId = file.props?.fileid
  if (!fileId) return null

  return payload.create({
    collection: 'files',
    data: {
      fileId,
      fileName: file.basename,
      modified: file.lastmod,
      size: file.size,
      location: file.filename,
    },
  })
}

export async function checkAndCreateFiles(files: FileStat[]) {
  const fileOps = files.map(async (file) => {
    const fileId = file.props?.fileid
    if (!fileId) return

    const existingFile = await payload.find({
      collection: 'files',
      where: { fileId: { equals: fileId } },
    })

    if (existingFile.totalDocs === 0) {
      return createFileInDB(file)
    }
  })

  return Promise.all(fileOps)
}

const getFileType = (filename: string): number => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? (FILE_TYPE_MAP.get(ext) ?? 8) : 8
}

export async function processFiles(files: FileStat[]) {
  const [mdFiles, otherFiles] = await Promise.all([
    files.filter((file) => file.basename.endsWith('.md')),
    files.filter((file) => !file.basename.endsWith('.md')),
  ])

  const knownMdFiles = mdFiles
    .filter((file) => mdFileInfo.some((info) => info.filename === file.basename))
    .map((file) => ({
      ...file,
      title: mdFileInfo.find((md) => md.filename === file.basename)!.title,
      description: mdFileInfo.find((md) => md.filename === file.basename)!.description,
    }))

  const unknownMdFiles = mdFiles.filter(
    (file) => !mdFileInfo.some((info) => info.filename === file.basename),
  )

  const [directories, regularFiles] = await Promise.all([
    otherFiles
      .filter((file) => file.type === 'directory')
      .sort((a, b) => a.basename.localeCompare(b.basename)),
    otherFiles
      .filter((file) => file.type === 'file')
      .sort((a, b) => {
        const typeA = getFileType(a.basename)
        const typeB = getFileType(b.basename)
        return typeA === typeB ? a.basename.localeCompare(b.basename) : typeA - typeB
      }),
  ])

  return {
    knownMdFiles,
    unknownMdFiles,
    directories,
    regularFiles,
  }
}

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp'])
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov'])

export function isFile(path: string) {
  return path.split('/').pop()?.includes('.') || false
}

export const isImage = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? IMAGE_EXTENSIONS.has(ext) : false
}

export const isVideo = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? VIDEO_EXTENSIONS.has(ext) : false
}

const FILE_TYPE_MAP = new Map([
  ['md', 0],
  ['pdf', 1],
  ['doc', 2],
  ['docx', 2],
  ['odt', 2],
  ['rtf', 2],
  ['xls', 3],
  ['xlsx', 3],
  ['ods', 3],
  ['csv', 3],
  ['ppt', 4],
  ['pptx', 4],
  ['py', 5],
  ['ipynb', 5],
  ['stl', 6],
  ['obj', 6],
  ['3mf', 6],
  ['fbx', 6],
  ['jpg', 7],
  ['jpeg', 7],
  ['png', 7],
  ['gif', 7],
  ['webp', 7],
])
