import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import type { Header } from '@/payload-types'
import Navigation from './Navigation'

//FIXME: add user auth

/**
 * Props for the Header component
 * @interface HeaderProps
 * @property {string} [className] - Optional CSS classes to apply to the header
 */
interface HeaderProps {
  className?: string
}

/**
 * Main header component with navigation
 * Contains the site logo and main navigation menu
 * Fixed positioned at the top of the page with blur effect
 *
 * @param {HeaderProps} props - Component props
 * @returns {Promise<JSX.Element|null>} Rendered header or null if data fetch fails
 */
export async function Header({ className }: HeaderProps) {
  // Fetch header data from PayloadCMS using cached global
  const data = (await getCachedGlobal('header', 1)()) as Header
  if (!data) return null

  return (
    <header className="relative">
      {/* Fixed navigation bar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-200 ease-in-out',
          className,
        )}
      >
        <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo/Home link */}
          <Link href="/" className="group">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
              {data.logo}
            </h2>
          </Link>

          {/* Navigation menu */}
          <div className="flex items-center gap-8">
            <Navigation
              navItems={data.navItems.map((item) => ({
                ...item,
                id: item.id ?? '', // Ensure id is always defined
              }))}
            />
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="w-full h-20" />
    </header>
  )
}
