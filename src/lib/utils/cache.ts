import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
})

export const withCache = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  const cached = cache.get(key)
  if (cached) return cached as T

  const result = await fn()
  cache.set(key, result)
  return result
}
