'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useRef, useEffect } from 'react'

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
    rounded-full text-gray-700 transition-all duration-300 ease-out 
    hover:bg-primary/10 active:scale-95 md:hidden"
    aria-controls="mobile-menu"
    aria-expanded={isOpen}
    onClick={onClick}
  >
    <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
    <span
      className="absolute -inset-0.5 rounded-full transition duration-300 group-hover:bg-primary/5"
      aria-hidden="true"
    ></span>
    {isOpen ? (
      <X className="h-5 w-5 transition-all duration-300 group-hover:rotate-90" />
    ) : (
      <Menu className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
    )}
  </button>
)

const MobileLink = ({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string
  label: string
  isActive: boolean
  onClick: () => void
}) => (
  <li className="transform transition-transform duration-300 will-change-transform">
    <Link
      href={href}
      className={`flex items-center px-6 py-5 text-lg font-medium
      transition-all duration-200 outline-none border-b
      border-gray-200 active:scale-[0.98] ${
        isActive
          ? 'text-primary font-semibold bg-primary/5 border-primary/10'
          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
      }`}
      onClick={onClick}
    >
      {label}
      {isActive && <span className="ml-2 h-1.5 w-1.5 rounded-full bg-primary"></span>}
    </Link>
  </li>
)

export const MobileMenu = ({ isOpen, navItems, pathname, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

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
        className={`fixed top-20 right-0 z-50 w-full max-w-sm h-[calc(100vh-5rem)] bg-white shadow-lg
        transition-transform duration-300 ease-in-out transform md:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        tabIndex={-1}
        aria-labelledby="mobile-menu-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full overflow-y-auto overscroll-contain">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
            <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900">
              Navigacija
            </h2>
          </div>

          <nav className="py-2">
            <ul>
              {navItems.map((item, index) => (
                <MobileLink
                  key={item.id || index}
                  href={item.href}
                  label={item.label}
                  isActive={pathname === item.href}
                  onClick={onClose}
                />
              ))}
            </ul>

            {/* Add Skripte button */}
            <div className="px-6 py-3">
              <Link
                href="/skripte"
                className="flex justify-center w-full px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium
                transition-all duration-300 hover:bg-primary hover:text-white active:scale-95"
                onClick={onClose}
              >
                Skripte
              </Link>
            </div>
          </nav>

          <div className="mt-auto border-t border-gray-100 p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-medium text-primary mb-1">Treba ti pomoć?</p>
              <p>Kontaktiraj nas direktno preko kontakt forme na početnoj strani.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

MobileMenuButton.displayName = 'MobileMenuButton'
MobileMenu.displayName = 'MobileMenu'
