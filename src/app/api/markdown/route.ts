import { NextRequest, NextResponse } from 'next/server'

// Cache duration (1 hour)
const CACHE_MAX_AGE = 60 * 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    const filename = searchParams.get('filename')

    if (!path || !filename) {
      return NextResponse.json({ error: 'Missing path or filename' }, { status: 400 })
    }

    const shareId = process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID
    if (!shareId) {
      console.error('Missing NEXT_PUBLIC_NEXTCLOUD_SHARE_ID environment variable')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const fileUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=/${encodeURIComponent(path)}/${filename}`
    console.log('markdown file url: ', fileUrl)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

    try {
      const response = await fetch(fileUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mehatronika-Website/1.0' },
      })
      clearTimeout(timeoutId)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Failed to fetch markdown - Status: ${response.status}`, errorText)
        return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status })
      }

      const contentType = response.headers.get('content-type')
      const text = await response.text()

      if (!text) {
        return NextResponse.json({ error: 'Empty response from file fetch' }, { status: 404 })
      }

      // Basic markdown validation - check for common markdown elements
      const seemsLikeMarkdown =
        contentType?.includes('text/markdown') ||
        contentType?.includes('text/plain') ||
        filename.endsWith('.md') ||
        /^#+ |^- |^```|\[.+\]\(.+\)/.test(text.slice(0, 1000))

      if (!seemsLikeMarkdown) {
        console.warn("Content doesn't appear to be valid markdown")
      }

      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/markdown',
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate`,
          'Access-Control-Allow-Origin': '*',
        },
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out' }, { status: 408 })
      }
      throw fetchError
    }
  } catch (error) {
    console.error('Markdown fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
