import { createClient, WebDAVClient } from 'webdav'

export const publicDavClient: WebDAVClient = createClient(
  `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL || 'https://cloud.itzpere.com'}/public.php/webdav/`,
  {
    username: process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID || '',
    password: '',
  },
)

export const getWebDAVContents = async (path: string, options?: any) => {
  return await publicDavClient.getDirectoryContents(path, options)
}
