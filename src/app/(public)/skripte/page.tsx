import { getPayload } from 'payload'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'
import configPromise from '@payload-config'
//moralo je ovde da boravi file sync zato sto vercel ne daje da se koristi njihov cronjob
//za planove koji nisu bar pro i takodje kad sam probao sa eksternog servera da pingam api
//logicno da je vercel blokirao apsolutno requist i da nije teo uopste da radi
//5 sati debugovanja kasnije ovo je doslo na red tkd bolje ista nego nista
//ocigledno ce biti problema u vezi toga da ljudi dodju na sajt i nema novih skripti ali
//to je neki problem za kasnije
//FIXME: pls
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
