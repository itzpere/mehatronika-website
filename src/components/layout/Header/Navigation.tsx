'use client'

import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import DesktopNavigation from './DesktopNavigation'
import { MobileMenuButton } from './MobileMenu'
import { MobileMenuPortal } from './MobileMenuPortal'

interface NavItem {
  id: string
  label: string
  href: string
}

interface NavigationProps {
  navItems: NavItem[]
}

const Navigation = ({ navItems }: NavigationProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className="flex items-center">
      <DesktopNavigation navItems={navItems} pathname={pathname} />
      <div className="md:hidden">
        <MobileMenuButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
        <MobileMenuPortal
          isOpen={isOpen}
          navItems={navItems}
          pathname={pathname}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  )
}

export default Navigation
