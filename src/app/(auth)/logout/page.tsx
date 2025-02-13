'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/utils/auth-client'
import { toast } from 'sonner'

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
