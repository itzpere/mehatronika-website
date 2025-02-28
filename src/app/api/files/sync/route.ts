import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'

// Get these from environment variables
const API_KEY = process.env.SYNC_API_KEY

export async function GET(_request: Request) {
  // Get IP address
  const headersList = await headers()
  const providedApiKey = headersList.get('x-api-key')

  // Security checks
  if (!API_KEY || API_KEY !== providedApiKey) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  })
}
