import React from 'react'
import '@/app/(frontend)/global.css'
import { Analytics } from '@vercel/analytics/react'
import { Header } from '@/Layout/Header'
import { Toaster } from 'sonner'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Mehatronika',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-background text-text">
        <Header className="border-b border-black" />
        <Toaster />
        {children}
        <Analytics />
        {/* TODO:You may want to add a Footer component here in the future */}
      </body>
    </html>
  )
}
