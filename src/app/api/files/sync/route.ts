import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'

export const maxDuration = 60 // Set to 300 seconds (5 minutes)
export const preferredRegion = 'auto'

export async function GET(_request: Request) {
  console.error('==== SYNC ENDPOINT CALLED ====')

  const headersList = await headers()
  const providedApiKey = headersList.get('x-api-key')

  if (!process.env.SYNC_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'API key not configured on server' },
      { status: 500 },
    )
  }

  if (providedApiKey !== process.env.SYNC_API_KEY) {
    return NextResponse.json({ success: false, error: 'Invalid API key provided' }, { status: 401 })
  }

  console.error('==== STARTING SYNC FUNCTION ====')

  // Start sync but don't await it
  syncFilesFromWebDAV()
    .then(() => console.error('==== SYNC COMPLETED SUCCESSFULLY ===='))
    .catch((e) => console.error('==== SYNC FAILED ====', e))

  // Return immediately
  return NextResponse.json({
    success: true,
    message: 'Sync process triggered in background',
  })
}
