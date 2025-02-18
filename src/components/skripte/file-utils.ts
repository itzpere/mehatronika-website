import { createClient } from 'webdav'

export interface FileStat {
  basename: string
  type: 'directory' | 'file'
  size: number
  lastmod: string
}

export const getWebDAVClient = () => {
  return createClient(process.env.WEBDAV_URL ?? '', {
    username: process.env.WEBDAV_USERNAME,
    password: process.env.WEBDAV_PASSWORD,
    headers: {
      'User-Agent': 'MyWebDAVClient/1.0',
    },
  })
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
