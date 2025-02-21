import React from 'react'
import '@/app/(public)/global.css'
import { Toaster } from 'sonner'

export const metadata = {
  description: 'Stranica za prijavljivanje i registraciju',
  title: 'Login',
}

export default async function AuthLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div>
      {children}
      <Toaster />
    </div>
  )
}
