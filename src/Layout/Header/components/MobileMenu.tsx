'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  navItems: NavItem[]
  pathname: string
  onClose: () => void
}

export const MobileMenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <button
    type="button"
    className="group relative inline-flex h-12 w-12 items-center justify-center 
    rounded-full text-text/80 transition-all duration-300 ease-out 
    hover:bg-primary/5 active:scale-95 md:hidden"
    aria-controls="mobile-menu"
    aria-expanded={isOpen}
    onClick={onClick}
  >
    <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
    {isOpen ? (
      <X className="h-5 w-5 transition-all duration-300 group-hover:rotate-90" />
    ) : (
      <Menu className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
    )}
  </button>
)

// Update MobileLinkProps
interface MobileLinkProps {
  href: string
  label: string
  onClick: () => void
}

// Update MobileLink component
const MobileLink = ({ href, label, onClick }: MobileLinkProps) => (
  <li>
    <Link
      href={href}
      className="flex items-center px-6 py-6 text-xl font-medium
      transition-all duration-200 outline-none border-b
      text-text/80 hover:bg-primary/5 hover:text-primary
      active:scale-[0.98] border-gray-200"
      onClick={onClick}
    >
      {label}
    </Link>
  </li>
)

export const MobileMenu = ({ isOpen, navItems, onClose }: MobileMenuProps) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300
        md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-[300px] transform overflow-hidden
        transition-all duration-300 ease-out md:hidden bg-background/95 shadow-lg
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="h-full pt-20">
          <ul className="bg-white">
            {navItems.map((item) => (
              <MobileLink key={item.id} href={item.href} label={item.label} onClick={onClose} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

MobileMenuButton.displayName = 'MobileMenuButton'
MobileMenu.displayName = 'MobileMenu'
