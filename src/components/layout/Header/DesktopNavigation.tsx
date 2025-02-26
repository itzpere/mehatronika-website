'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/auth-client'

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
}

const NavLink = ({ href, label, isActive }: NavLinkProps) => (
  <Link
    href={href}
    className={`group relative px-3 py-2 text-base font-medium 
    transition-colors duration-300 ${
      isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
    <span
      className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 
      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
      aria-hidden="true"
    />
  </Link>
)

interface NavItem {
  id: string
  label: string
  href: string
}

interface DesktopNavigationProps {
  navItems: NavItem[]
  pathname: string
}

const DesktopNavigation = ({ navItems, pathname }: DesktopNavigationProps) => {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession()
        setSession(data)
      } catch (err) {
        console.error('Failed to get session', err)
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      toast.success('Uspešno ste se odjavili')
      window.location.reload() // Force refresh after logout
    } catch (err) {
      toast.error('Greška prilikom odjavljivanja')
      console.error('Logout failed', err)
    }
  }

  return (
    <div className="hidden md:flex md:items-center md:gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.id || item.href}
          href={item.href}
          label={item.label}
          isActive={pathname === item.href}
        />
      ))}

      <div className="h-6 w-px bg-gray-200 mx-3" aria-hidden="true"></div>

      {!loading && session?.user ? (
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm
          transition-all duration-300 hover:bg-secondary hover:text-white active:scale-95"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          className="ml-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm
          transition-all duration-300 hover:bg-secondary hover:text-white active:scale-95"
        >
          Login
        </Link>
      )}

      <Link
        href="/skripte"
        className="ml-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm
        transition-all duration-300 hover:bg-primary hover:text-white active:scale-95"
      >
        Skripte
      </Link>
    </div>
  )
}

NavLink.displayName = 'NavLink'
DesktopNavigation.displayName = 'DesktopNavigation'

export default DesktopNavigation
