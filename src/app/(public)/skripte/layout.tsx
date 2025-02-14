import { Analytics } from '@vercel/analytics/react'
import React from 'react'
import '@/app/(public)/global.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { AppSidebar } from '@/components/skripte/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Skripte',
}
//TODO: namesti metadata
export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-background text-text">
        <Header className="border-b border-black" />
        <Toaster />
        <div className="top-20">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
