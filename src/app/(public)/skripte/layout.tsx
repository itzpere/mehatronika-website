import { getPayload } from 'payload'
import React from 'react'
import '@/app/(public)/global.css'
import { Header } from '@/components/layout/Header'
import { AppSidebar } from '@/components/skripte/app-sidebar'
import { BreadcrumbHeader } from '@/components/skripte/breadcrumbHeader'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { syncFilesFromWebDAV } from '@/hooks/webdav-sync'
import configPromise from '@payload-config'
import type { Payload } from 'payload'

export const metadata = {
  title: 'Skripte',
  description: 'Skripte za mehatroniku',
  openGraph: {
    title: 'Skripte',
    description: 'Skripte za mehatroniku',
    type: 'website',
  },
}

async function forceReleaseLockIfStale(payload: Payload): Promise<void> {
  const lock = await payload.findGlobal({ slug: 'syncLock' })
  console.log(lock)
  if (lock?.isRunning && lock?.lastSync) {
    const lockTimestamp = new Date(lock.lastSync).getTime()
    const currentTime = Date.now()
    // If lock is more than 5 minutes old, force release it
    if (currentTime - lockTimestamp > 5 * 60 * 1000) {
      console.log('Force releasing stale lock')
      await payload.updateGlobal({
        slug: 'syncLock',
        data: { isRunning: false },
      })
    }
  }
}

export default async function ScriptsLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({
    config: configPromise,
  })

  // Only check for stale locks
  await forceReleaseLockIfStale(payload)

  // Check if sync should run (not running or expired)
  const lock = await payload.findGlobal({
    slug: 'syncLock',
  })

  const now = new Date()
  const lockExpiry = lock?.lastSync ? new Date(new Date(lock.lastSync).getTime() + 5 * 60000) : null

  if (!lock?.isRunning || (lockExpiry && now > lockExpiry)) {
    // Just start the sync and don't wait
    syncFilesFromWebDAV()
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header className="border-b border-black sticky top-0 z-50 bg-background" />

      <SidebarProvider>
        <main className="flex flex-1 min-h-0 w-full">
          <AppSidebar className="hidden md:block" />

          <SidebarInset className="relative isolate flex-1 w-full">
            <BreadcrumbHeader
              className="sticky top-0 z-20 bg-background w-full border-b border-sidebar-border shadow-sm"
              aria-label="Page navigation"
            />

            <div className="relative h-[calc(100vh-5rem)] w-full">
              <div className="h-full overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent px-3 sm:px-4 md:px-6 lg:px-8 overscroll-contain">
                <div className="animate-fade-up pb-safe">{children}</div>

                <div className="mt-8 mb-12 sm:mt-10 sm:mb-16 opacity-70 text-sm text-center text-muted-foreground">
                  <p>Koristite navigaciju ili pretragu za pronalaženje materijala</p>
                </div>
              </div>

              <div
                className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none"
                role="presentation"
              />
            </div>
          </SidebarInset>
        </main>
      </SidebarProvider>
    </div>
  )
}
