import { getCachedGlobal } from '@/Utils/getGlobals'
import Navigation from './components/Navigation'
import type { Header } from '@/payload-types'
import Link from 'next/link'

export async function Header() {
  const data = (await getCachedGlobal('header', 1)()) as Header
  if (!data) {
    console.error('Failed to fetch header data')
    return null
  }
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-200 ease-in-out">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
  )
}
