import { LRUCache } from 'lru-cache'
import { createClient, WebDAVClient } from 'webdav'

export const publicDavClient: WebDAVClient = createClient(
  `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL || 'https://cloud.itzpere.com'}/public.php/webdav/`,
  {
    username: process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID || '',
    password: '',
  },
)

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
})

export const getWebDAVContents = async (path: string, options?: any) => {
  const cacheKey = `webdav:${path}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const contents = await publicDavClient.getDirectoryContents(path, options)
  cache.set(cacheKey, contents)
  return contents
}
