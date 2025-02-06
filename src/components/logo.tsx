import Link from 'next/link'
import Image from 'next/image'
import { FC } from 'react'

const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative h-8 w-24">
        <Image
          src="/img/logo.svg"
          alt="Logo"
          fill
          priority
          className="object-contain invert-0 transition-all duration-200 dark:invert"
        />
      </div>
    </Link>
  )
}

Logo.displayName = 'Logo'

export default Logo
