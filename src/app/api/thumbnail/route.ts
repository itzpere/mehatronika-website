import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createClient } from 'webdav'

const getWebDAVClient = () => {
  return createClient(process.env.WEBDAV_URL ?? '', {
    username: process.env.WEBDAV_USERNAME,
    password: process.env.WEBDAV_PASSWORD,
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path')

  if (!path) {
    return new NextResponse('Missing path', { status: 400 })
  }

  try {
    const client = getWebDAVClient()
    const file = await client.getFileContents(path)

    if (!(file instanceof Buffer)) {
      return new NextResponse('Invalid file', { status: 400 })
    }

    const thumbnail = await sharp(file)
      .resize(64, 64, {
        fit: 'cover',
        position: 'center',
      })
      .toBuffer()

    return new NextResponse(thumbnail, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Error processing image', { status: 500 })
  }
}
