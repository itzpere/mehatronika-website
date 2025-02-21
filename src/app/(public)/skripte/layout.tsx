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
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Skripte',
}

export default function ScriptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header className="flex-none" />
      <div className="flex-1 min-h-0">
        {' '}
        {/* Added min-h-0 */}
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="h-full">
            <BreadcrumbHeader className="fixed top-20 z-10 bg-background w-full" />
            <div className="h-[calc(100vh-1rem)] pt-40">
              {' '}
              {/* Added fixed height container */}
              <React.Suspense>{children}</React.Suspense>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
//FIXME: scrol bar ide preko headera i headera bread crumb
