'use client'

import React from 'react'
import Link from 'next/link'

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
}

const NavLink = ({ href, label, isActive }: NavLinkProps) => (
  <Link
    href={href}
    className={`rounded-xl px-3 py-2 font-semibold transition-colors text-gray-900 duration-200 hover:bg-gray-100  ${
      isActive ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900'
    }`}
  >
    {label}
  </Link>
)

interface DesktopNavigationProps {
  navItems: readonly { label: string; href: string }[]
  pathname: string
}

const DesktopNavigation = ({ navItems, pathname }: DesktopNavigationProps) => {
  return (
    <div
      className="hidden md:flex md:space-x-8"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        contain: 'layout style',
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          isActive={pathname === item.href}
        />
      ))}
    </div>
  )
}

NavLink.displayName = 'NavLink'
DesktopNavigation.displayName = 'DesktopNavigation'

export default DesktopNavigation
