import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const filename = searchParams.get('filename')

  if (!path || !filename) {
    return new NextResponse('Missing path or filename', { status: 400 })
  }

  const shareId = process.env.NEXT_PUBLIC_NEXTCLOUD_SHARE_ID
  const fileUrl = `https://cloud.itzpere.com/s/${shareId}/download?path=/${encodeURIComponent(path)}/${filename}`

  const response = await fetch(fileUrl)
  const blob = await response.blob()

  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
