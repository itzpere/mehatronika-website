import { Analytics } from '@vercel/analytics/react'
import React from 'react'
import './global.css'
import { Toaster } from 'sonner'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Mehatronika',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-background text-text">
        <Header />
        <Toaster />
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}
