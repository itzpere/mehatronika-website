import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'

export const maxDuration = 300 // Set to 300 seconds (5 minutes)
export const preferredRegion = 'auto'

export async function GET(_request: Request) {
  console.error('==== SYNC ENDPOINT CALLED ====')

  const headersList = headers()
  const providedApiKey = headersList.get('x-api-key')
  console.error(`API Key check: ${!!providedApiKey} vs ${!!process.env.SYNC_API_KEY}`)

  if (!process.env.SYNC_API_KEY) {
    console.error('Missing SYNC_API_KEY in environment')
    return NextResponse.json(
      { success: false, error: 'API key not configured on server' },
      { status: 500 },
    )
  }

  if (providedApiKey !== process.env.SYNC_API_KEY) {
    console.error('API key mismatch')
    return NextResponse.json({ success: false, error: 'Invalid API key provided' }, { status: 401 })
  }

  console.error('==== STARTING SYNC FUNCTION ====')

  try {
    // Actually wait for the function to complete
    await syncFilesFromWebDAV()
    console.error('==== SYNC COMPLETED SUCCESSFULLY ====')

    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully',
    })
  } catch (error) {
    console.error('==== SYNC FAILED ====', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Sync process failed',
      },
      { status: 500 },
    )
  }
}
