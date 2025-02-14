'use client'

import Link from 'next/link'
import React from 'react'

interface NavLinkProps {
  href: string
  label: string
}

const NavLink = ({ href, label }: NavLinkProps) => (
  <Link
    href={href}
    className="group relative px-3 py-2 text-base font-medium text-gray-600 
    transition-colors duration-300 hover:text-primary"
  >
    {label}
    <span
      className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 
      bg-primary transition-transform duration-300 group-hover:scale-x-100"
    />
  </Link>
)

interface NavItem {
  id: string
  label: string
  href: string
}

const DesktopNavigation = ({ navItems }: { navItems: NavItem[] }) => {
  return (
    <div className="hidden md:flex md:items-center md:gap-6">
      {navItems.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  )
}

NavLink.displayName = 'NavLink'
DesktopNavigation.displayName = 'DesktopNavigation'

export default DesktopNavigation
