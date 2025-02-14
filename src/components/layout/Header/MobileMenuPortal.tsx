'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MobileMenu } from './MobileMenu'

interface NavItem {
  id: string
  label: string
  href: string
}

interface MobileMenuPortalProps {
  isOpen: boolean
  navItems: NavItem[]
  pathname: string
  onClose: () => void
}

export const MobileMenuPortal = ({ isOpen, ...props }: MobileMenuPortalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(<MobileMenu isOpen={isOpen} {...props} />, document.body)
}
