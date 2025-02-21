'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/auth-client'

export const metadata = {
  description: 'Stranica za prijavljivanje i registraciju',
  title: 'Logout',
}

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        await authClient.signOut()
        toast.success('Uspešno ste se odjavili')
        router.push('/')
        router.refresh()
      } catch (error) {
        console.error('Logout error:', error)
        toast.error('Greška pri odjavljivanju')
      }
    }

    logout()
  }, [router])

  return null
}
