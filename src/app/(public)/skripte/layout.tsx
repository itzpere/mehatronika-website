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
  description: 'Skripte za mehatroniku',
  title: 'Skripte',
}

export default function ScriptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header className="flex-none border-b border-black" />
      <div className="flex-1 min-h-0">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="h-full">
            <BreadcrumbHeader className="fixed top-20 z-20 bg-background w-full" />
            <div className="relative h-[calc(100vh-1rem)]">
              <div className="absolute top-36 left-0 right-0 h-2 bg-gradient-to-b from-background via-background/50 to-transparent z-10" />
              <div className="h-full pt-36 overflow-y-auto">
                <React.Suspense>{children}</React.Suspense>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
