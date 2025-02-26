import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import Navigation from './Navigation'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  // Hardcoded navigation items
  const navItems: { id: string; label: string; href: string }[] = []

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-500 bg-white/80 backdrop-blur-md border-b border-gray-100',
        className,
      )}
    >
      <nav className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
            Mehatronika
          </h2>
        </Link>

        <div className="flex items-center gap-8">
          <Navigation navItems={navItems} />
        </div>
      </nav>
    </header>
  )
}
