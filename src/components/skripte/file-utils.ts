import { WebDAVClient } from 'webdav'
import { davClient } from '@/lib/utils/webdav'
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

export const getWebDAVClient = (): WebDAVClient => {
  const originalGetDirectoryContents = davClient.getDirectoryContents.bind(davClient)
  davClient.getDirectoryContents = async (path: string, options?: any) => {
    const response = (await originalGetDirectoryContents(path, options)) as unknown as {
      data: FileStat[]
    }

    const files = response.data.map((file) => ({
      ...file,
      props: {
        ...file.props,
        fileid: Number(file.props?.fileid) || null,
      },
    }))

    return files
  }
  return davClient
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

export const isImage = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')
}

export const isVideo = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ['mp4', 'webm', 'mov'].includes(ext || '')
}

export const getFileType = (filename: string): number => {
  if (filename.endsWith('.md')) return 0
  const ext = filename.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'pdf':
      return 1
    case 'doc':
    case 'docx':
    case 'odt':
    case 'rtf':
      return 2
    case 'xls':
    case 'xlsx':
    case 'ods':
    case 'csv':
      return 3
    case 'ppt':
    case 'pptx':
      return 4
    case 'py':
    case 'ipynb':
      return 5
    case 'stl':
    case 'obj':
    case '3mf':
    case 'fbx':
      return 6
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 7
    default:
      return 8
  }
}
