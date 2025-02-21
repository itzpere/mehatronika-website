import { Analytics } from '@vercel/analytics/react'
import React from 'react'
import './global.css'
import { Toaster } from 'sonner'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Mehatronika',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-text text-wrap">
        <Toaster />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
