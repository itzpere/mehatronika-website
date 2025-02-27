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
              {/* Main content with improved scrolling experience */}
              <div className="h-full overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent px-3 sm:px-4 md:px-6 lg:px-8 overscroll-contain">
                {/* Appear animation for content */}
                <div className="animate-fade-up pb-safe">{children}</div>

                {/* Navigation hints for new users */}
                <div className="mt-8 mb-12 sm:mt-10 sm:mb-16 opacity-70 text-sm text-center text-muted-foreground">
                  <p>Koristite navigaciju ili pretragu za pronalaženje materijala</p>
                </div>
              </div>

              {/* Bottom gradient fade */}
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
