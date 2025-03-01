import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'

// Get these from environment variables

export async function GET(_request: Request) {
  const headersList = await headers()
  const providedApiKey = headersList.get('x-api-key')

  // Security checks with more detailed errors
  if (!process.env.SYNC_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'API key not configured on server' },
      { status: 500 },
    )
  }

  if (providedApiKey !== process.env.SYNC_API_KEY) {
    return NextResponse.json({ success: false, error: 'Invalid API key provided' }, { status: 401 })
  }

  syncFilesFromWebDAV().catch((error) => {
    console.error('Sync failed:', error)
  })
  return NextResponse.json({ success: true })
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
