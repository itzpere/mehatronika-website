import { getCachedGlobal } from '@/lib/utils/getGlobals'
import Navigation from './components/Navigation'

interface NavItem {
  id: string
  label: string
  href: string
}

interface HeaderData {
  id: number
  navItems: NavItem[]
  logo: string
  updatedAt: string
  createdAt: string
  globalType: string
}

export async function Header() {
  const data = (await getCachedGlobal('header', 1)()) as HeaderData

  return (
    <nav className="w-full border-gray-200 bg-white" style={{ contain: 'content' }}>
      <div
        className="mx-auto flex max-w-screen-xl items-center justify-between p-6"
        style={{ transform: 'translateZ(0)' }}
      >
        <h2 className="font-bold">{data.logo}</h2>
        <div className="flex items-center gap-4">
          <Navigation navItems={data.navItems} />
        </div>
      </div>
    </nav>
  )
}
