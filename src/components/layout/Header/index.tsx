import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import type { Header } from '@/payload-types'
import Navigation from './Navigation'

interface HeaderProps {
  className?: string
}

export async function Header({ className }: HeaderProps) {
  const data = (await getCachedGlobal('header', 1)()) as Header
  if (!data) return null

  return (
    <header className="relative">
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-200 ease-in-out',
          className,
        )}
      >
        <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
              {data.logo}
            </h2>
          </Link>
          <div className="flex items-center gap-8">
            <Navigation
              navItems={data.navItems.map((item) => ({
                ...item,
                id: item.id ?? '',
              }))}
            />
          </div>
        </div>
      </nav>
      <div className="w-full h-20" /> {/* Match header height exactly */}
    </header>
  )
}
