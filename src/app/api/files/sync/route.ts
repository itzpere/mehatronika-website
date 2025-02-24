import { NextResponse } from 'next/server'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'

export async function GET() {
  try {
    await syncFilesFromWebDAV()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sync failed:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}

// Add OPTIONS to handle preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
