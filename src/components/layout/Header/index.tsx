'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import DesktopNavigation from './DesktopNavigation'
import { MobileMenuButton } from './MobileMenu'
import { MobileMenuPortal } from './MobileMenuPortal'

interface NavItem {
  id: string
  label: string
  href: string
}

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const [toolsOpen, setToolsOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add mouseenter and mouseleave handlers with delay
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setToolsOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setToolsOpen(false)
    }, 200) // 200ms delay before closing
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Hardcoded navigation items
  const navItems: NavItem[] = []

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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-500 bg-white/80 backdrop-blur-md border-b border-gray-100',
        className,
      )}
    >
      <nav className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="group">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
              Mehatronika
            </h2>
          </Link>

          {/* Tools dropdown with hover */}
          <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)} // Keep click for accessibility
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-primary h-10 py-2 px-4"
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              Alati
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
                <div className="py-1">
                  <Link
                    href="https://pdf.mehatronika.xyz"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    onClick={() => setToolsOpen(false)}
                  >
                    PDF
                  </Link>
                  <Link
                    href="https://it-tools.tech/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    onClick={() => setToolsOpen(false)}
                  >
                    IT
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

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
      </nav>
    </header>
  )
}
