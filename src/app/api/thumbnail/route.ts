import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { davClient } from '@/lib/utils/webdav'

function isValidPath(path: string) {
  // Prevent path traversal attacks
  return !path.includes('../') && !path.includes('..\\')
}

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path')

  if (!path || !isValidPath(path)) {
    return new NextResponse('Invalid path', { status: 400 })
  }

  try {
    const file = await davClient.getFileContents(path)

    if (!(file instanceof Buffer)) {
      return new NextResponse('Invalid file', { status: 400 })
    }

    if (file.length > MAX_SIZE) {
      return new NextResponse('File too large', { status: 413 })
    }

    const thumbnail = await sharp(file)
      .resize(64, 64, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer()

    return new NextResponse(thumbnail, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Security-Policy': "default-src 'none'; img-src 'self'",
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse('Error processing image', { status: 500 })
  }
}
