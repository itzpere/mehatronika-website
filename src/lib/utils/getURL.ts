import canUseDOM from './canUseDOM'

// Cache for URL results
const urlCache = new Map<string, string>()

/**
 * Gets the server-side URL based on environment
 * @returns {string} The resolved server URL
 */
export const getServerSideURL = (): string => {
  const cacheKey = 'server-side'
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }

  let url = process.env.NEXT_PUBLIC_SERVER_URL?.trim()

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`
  }

  url = url || 'http://localhost:3000'

  // Ensure URL is properly formatted
  try {
    new URL(url)
    urlCache.set(cacheKey, url)
    return url
  } catch {
    console.warn(`Invalid URL: ${url}, falling back to localhost`)
    return 'http://localhost:3000'
  }
}

/**
 * Gets the client-side URL based on environment
 * @returns {string} The resolved client URL
 */
export const getClientSideURL = (): string => {
  const cacheKey = 'client-side'
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }

  let url: string

  if (canUseDOM) {
    const { protocol, hostname, port } = window.location
    url = `${protocol}//${hostname}${port ? `:${port}` : ''}`
  } else {
    url = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`
      : process.env.NEXT_PUBLIC_SERVER_URL?.trim() || ''
  }

  try {
    if (url) new URL(url)
    urlCache.set(cacheKey, url)
    return url
  } catch {
    console.warn(`Invalid URL: ${url}, falling back to empty string`)
    return ''
  }
}
