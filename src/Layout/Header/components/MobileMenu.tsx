'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

// Mobile menu button
interface MobileMenuProps {
  isOpen: boolean;
  navItems: readonly { label: string; href: string }[];
  pathname: string;
  onClose: () => void;
}
export const MobileMenuButton =
  ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <button
      type="button"
      className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-700"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className="sr-only">Open main menu</span>
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );


// Mobile link
interface MobileLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}
const MobileLink = ({ href, label, isActive, onClick }: MobileLinkProps) => (
  <li className="my-2">
    <Link
      href={href}
      className={`block rounded-md px-4 py-2 font-bold transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900 ${
        isActive ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900 dark:text-white'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  </li>
);

// Mobile menu

export const MobileMenu = ({ isOpen, navItems, pathname, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Base overlay without blur */}

      <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={onClose} />

      {/* Blur layer */}

      <div className="pointer-events-none fixed inset-0 top-[73px] z-40 backdrop-blur-sm md:hidden" />

      {/* Menu container */}

      <div
        className={`fixed top-[73px] right-0 left-0 z-50 transform overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          contain: 'paint layout style',
        }}
      >
        <ul className="mx-auto max-w-screen-xl border-y border-gray-700 bg-gray-800/80 p-4 text-center shadow-lg backdrop-blur-sm">
          {navItems.map((item) => (
            <MobileLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={pathname === item.href}
              onClick={onClose}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

MobileMenuButton.displayName = 'MobileMenuButton';
MobileMenu.displayName = 'MobileMenu';
