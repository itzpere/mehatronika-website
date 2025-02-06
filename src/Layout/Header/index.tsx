import React from 'react'
// import Logo from '@/components/logo'
import Navigation from './components/Navigation'

const navItems = Object.freeze([
  { label: 'Kontakt', href: '#' },
  { label: 'sta je mehatronika', href: '##' },
  { label: 'Forum', href: '###' },
])

const Header = () => {
  return (
    <nav className="w-full border-gray-200 bg-white" style={{ contain: 'content' }}>
      <div
        className="mx-auto flex max-w-screen-xl items-center justify-between p-6"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* <Logo /> */}
        <h2 className="font-bold">Mehatronika</h2>
        <Navigation navItems={navItems} />
      </div>
    </nav>
  )
}

Header.displayName = 'Header'

export default Header
