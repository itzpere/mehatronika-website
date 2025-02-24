import { getPayload } from 'payload'
import type { File } from '@/payload-types'
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
  title?: string
  description?: string
}

const payload = await getPayload({
  config: configPromise,
})

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

export async function processFiles(files: File[]) {
  const fileGroups = files.reduce(
    (acc, file) => {
      if (file.name.endsWith('.md')) {
        const mdInfo = mdFileInfo.find((info) => info.filename === file.name)
        if (mdInfo) {
          acc.knownMdFiles.push({ ...file, ...mdInfo })
        } else {
          acc.unknownMdFiles.push(file)
        }
      } else {
        acc.regularFiles.push(file)
      }
      return acc
    },
    {
      knownMdFiles: [] as (File & { title: string; description: string })[],
      unknownMdFiles: [] as File[],
      regularFiles: [] as File[],
    },
  )

  fileGroups.regularFiles.sort((a, b) => {
    const typeA = getFileType(a.name)
    const typeB = getFileType(b.name)
    return typeA === typeB ? a.name.localeCompare(b.name) : typeA - typeB
  })

  return fileGroups
}

export async function getAllFolders() {
  const folders = await payload.find({
    collection: 'folders',
    where: {
      deleted: { equals: false },
    },
    limit: 1000,
    sort: 'currentPath',
  })

  return folders.docs
}

export async function getContentsByPath(path: string) {
  const sanitizedPath = path?.trim() || '/'

  const folder = await payload.find({
    collection: 'folders',
    where: {
      ...(sanitizedPath === '/'
        ? { uuid: { equals: 0 } }
        : { currentPath: { equals: sanitizedPath } }),
      deleted: { equals: false },
    },
    limit: 1,
  })
  const folderId = folder.docs[0]?.uuid

  if (!folderId) {
    console.error(`No folder found for path: ${path}`)
    return { folders: [], files: [] }
  }

  // Get all subfolders with this parent ID
  const folders = await payload.find({
    collection: 'folders',
    where: {
      parentId: { equals: folderId },
      deleted: { equals: false },
    },
    sort: 'name',
    limit: 1000,
  })

  // Get all files with this parent ID
  const files = await payload.find({
    collection: 'files',
    where: {
      parentId: { equals: folderId },
      deleted: { equals: false },
    },
    sort: 'name',
    limit: 1000,
  })

  return {
    folders: folders.docs,
    files: files.docs,
  }
}

const getFileType = (filename: string): number => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? (FILE_TYPE_MAP.get(ext) ?? 8) : 8
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
