import React from 'react'
import '@/app/(public)/global.css'
import { Header } from '@/components/layout/Header'
import { AppSidebar } from '@/components/skripte/app-sidebar'
import { BreadcrumbHeader } from '@/components/skripte/header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

// Force static rendering
export const dynamic = 'force-static'
export const revalidate = false
export const fetchCache = 'force-cache'

export const metadata = {
  title: 'Skripte',
  description: 'Skripte za mehatroniku',
  openGraph: {
    title: 'Skripte',
    description: 'Skripte za mehatroniku',
    type: 'website',
  },
}

export default function ScriptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden">
      <Header className="border-b border-black" />

      <SidebarProvider>
        <main className="grid grid-cols-[auto_1fr] min-h-0 w-full">
          <AppSidebar />

          <SidebarInset className="relative isolate">
            <BreadcrumbHeader
              className="fixed top-20 z-20 bg-background w-full"
              aria-label="Page navigation"
            />

            <div className="relative h-[calc(100vh-5rem)]">
              {/* Top gradient fade */}
              <div
                className="absolute inset-x-0 top-36 h-2 bg-gradient-to-b from-background via-background/50 to-transparent z-10"
                role="presentation"
              />

              {/* Main content */}
              <div className="h-full pt-36 overflow-y-auto scroll-smooth">{children}</div>

              {/* Bottom gradient fade */}
              <div
                className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-background via-background/50 to-transparent"
                role="presentation"
              />
            </div>
          </SidebarInset>
        </main>
      </SidebarProvider>
    </div>
  )
}
