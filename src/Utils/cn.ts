import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const MAX_CACHE_SIZE = 100
const cache = new Map<string, string>()

export function cn(...inputs: ClassValue[]): string {
  try {
    const key = JSON.stringify(inputs)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = twMerge(clsx(inputs))

    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value
      if (firstKey !== undefined) {
        cache.delete(firstKey) // Remove oldest entry instead of clearing all
      }
    }

    cache.set(key, result)
    return result
  } catch (_error) {
    // Fallback if JSON.stringify fails
    return twMerge(clsx(inputs))
  }
}
