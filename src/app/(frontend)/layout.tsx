import React from 'react'
import './global.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Mehatronika',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  )
}
