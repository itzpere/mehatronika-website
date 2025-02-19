import { Analytics } from '@vercel/analytics/react'
import React from 'react'
import '@/app/(public)/global.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { AppSidebar } from '@/components/skripte/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

// Force static rendering
export const dynamic = 'force-static'
export const revalidate = false
export const fetchCache = 'force-cache'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Skripte',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-hidden">
      <body className="bg-background text-text h-screen flex flex-col">
        <Header className="border-b border-black" />
        <Toaster />
        <div className="flex-1 overflow-hidden">
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <React.Suspense>{children}</React.Suspense>
            </SidebarInset>
          </SidebarProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
