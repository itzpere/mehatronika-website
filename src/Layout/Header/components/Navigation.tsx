'use client'

import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import DesktopNavigation from './DesktopNavigation'
import { MobileMenuButton, MobileMenu } from './MobileMenu'

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
  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <>
      <div className="flex items-center">
        <DesktopNavigation navItems={navItems} pathname={pathname} />
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
          <MobileMenuButton isOpen={isOpen} onClick={toggleMenu} />
        </div>
      </div>
      {typeof window !== 'undefined' &&
        createPortal(
          <MobileMenu
            isOpen={isOpen}
            navItems={navItems}
            pathname={pathname}
            onClose={() => setIsOpen(false)}
          />,
          document.body,
        )}
    </>
  )
}

Navigation.displayName = 'Navigation'
export default Navigation
