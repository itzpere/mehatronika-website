'use client'

import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
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

  return (
    <div className="flex items-center">
      <DesktopNavigation navItems={navItems} />
      <div className="md:hidden">
        {' '}
        {/* Wrap mobile elements */}
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

Navigation.displayName = 'Navigation'
export default Navigation
