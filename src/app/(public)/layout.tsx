import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
// Use next/metadata for better type safety and IDE support
import './global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Mehatronika',
    template: '%s | Mehatronika',
  },
  description: 'Stranica za studente mehatronike',
  metadataBase: new URL('https://mehatronika.xyz'), // Add your domain
  openGraph: {
    title: 'Mehatronika',
    description: 'Stranica za studente mehatronike',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" suppressHydrationWarning className="antialiased">
      <head />
      <body className="min-h-screen bg-background text-text font-sans selection:bg-primary/10">
        <Toaster position="bottom-right" closeButton richColors />
        <main>{children}</main>
        <Analytics mode="production" />
      </body>
    </html>
  )
}
