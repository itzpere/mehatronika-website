import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'

// Get these from environment variables

export async function GET(_request: Request) {
  console.error('==== SYNC ENDPOINT CALLED ====') // Will show in Vercel logs

  const headersList = await headers()
  const providedApiKey = headersList.get('x-api-key')
  console.error(`API Key check: ${!!providedApiKey} vs ${!!process.env.SYNC_API_KEY}`)

  // Security checks
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
    // Start sync and immediately return
    const syncPromise = syncFilesFromWebDAV()

    // Add explicit debug points in the promise chain
    syncPromise
      .then(() => console.error('==== SYNC COMPLETED SUCCESSFULLY ===='))
      .catch((error) => console.error('==== SYNC FAILED ====', error))

    return NextResponse.json({
      success: true,
      message: 'Sync triggered - check logs for progress',
    })
  } catch (error) {
    console.error('==== IMMEDIATE ERROR STARTING SYNC ====', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start sync process',
      },
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
