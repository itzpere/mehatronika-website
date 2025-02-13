import React from 'react'
import '@/app/(frontend)/global.css'
import { Toaster } from 'sonner'

export const metadata = {
  description: 'Stranica za prijavljivanje i registraciju',
  title: 'Login',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-background text-text">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
