import { getPayload } from 'payload'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'
import configPromise from '@payload-config'

export default async function Page() {
  const payload = await getPayload({
    config: configPromise,
  })

  // Check if sync is already running
  const lock = await payload.findGlobal({
    slug: 'syncLock',
  })

  const now = new Date()
  const lockExpiry = lock?.lastSync ? new Date(new Date(lock.lastSync).getTime() + 5 * 60000) : null

  // Only sync if no lock exists or lock has expired (5 min timeout)
  if (!lock?.isRunning || (lockExpiry && now > lockExpiry)) {
    // Set lock
    await payload.updateGlobal({
      slug: 'syncLock',
      data: {
        isRunning: true,
        lastSync: now.toISOString(),
      },
    })

    // Run sync in background
    syncFilesFromWebDAV()
      .catch(console.error)
      .finally(async () => {
        // Release lock when done
        await payload.updateGlobal({
          slug: 'syncLock',
          data: { isRunning: false },
        })
      })
  }

  return <div className="relative h-full w-full">{/* Your page content */}</div>
}
