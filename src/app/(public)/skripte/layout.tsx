import React from 'react'
import '@/app/(public)/global.css'
import { Header } from '@/components/layout/Header'
import { AppSidebar } from '@/components/skripte/app-sidebar'
import { BreadcrumbHeader } from '@/components/skripte/breadcrumbHeader'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

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
      <Header className="border-b border-black sticky top-0  bg-background" />

      <SidebarProvider>
        <main className="grid grid-cols-[auto_1fr] min-h-0 w-full">
          <AppSidebar />

          <SidebarInset className="relative isolate">
            <BreadcrumbHeader
              className="sticky top-0 z-20 bg-background w-full border-b border-sidebar-border shadow-sm"
              aria-label="Page navigation"
            />

            <div className="relative h-[calc(100vh-5rem)]">
              {/* Main content with improved scrolling experience */}
              <div className="h-full pt-12 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent px-4 md:px-6 lg:px-8">
                {/* Appear animation for content */}
                <div className="animate-fade-up">{children}</div>

                {/* Navigation hints for new users */}
                <div className="mt-10 mb-16 opacity-70 text-sm text-center text-muted-foreground">
                  <p>Koristite navigaciju ili pretragu za pronalaženje materijala</p>
                </div>
              </div>

              {/* Bottom gradient fade */}
              <div
                className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background via-background/50 to-transparent"
                role="presentation"
              />
            </div>
          </SidebarInset>
        </main>
      </SidebarProvider>
    </div>
  )
}
