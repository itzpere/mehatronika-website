import { SiDiscord } from '@icons-pack/react-simple-icons'
import { ArrowRight, Coffee, Heart } from 'lucide-react'
import Link from 'next/link'
import pkg from '../../../../package.json'

const version = `v${pkg.version}`

const SocialIcon = {
  discord: SiDiscord,
}

const data = {
  columns: [
    {
      title: 'Resursi',
      links: [
        { label: 'Skripte', url: '/skripte' },
        { label: 'Login', url: '/login' },
      ],
    },
  ],
  socialLinks: [{ platform: 'discord', url: 'https://discord.com/invite/R5s47krDan' }] as {
    platform: 'discord'
    url: string
  }[],
  copyright: '© 2025 Mehatronika. Sva prava zadržana.',
}

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-gradient-to-b from-white via-gray-50 to-gray-100 border-t border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          {/* Brand and description column */}
          <div className="max-w-sm mx-auto">
            {/* Donation section */}
            <div className="bg-gradient-to-r from-amber-50 via-amber-50 to-white p-5 rounded-xl border border-amber-200 shadow-sm">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 fill-amber-500 text-amber-500" />
                Podržite naš rad
              </h3>
              <p className="text-gray-600 mb-3 text-sm">
                Pomozite nam da održimo resurse besplatnim i otvorenim za sve studente.
              </p>
              <a
                href="https://buymeacoffee.com/mehatronika"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-all active:scale-[0.98] transform shadow-sm"
              >
                <Coffee className="h-5 w-5 mr-2" />
                Častite nas kaficom
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-6 w-full mt-8 md:mt-0">
            {data.columns.map((column, index) => (
              <div key={index} className="min-w-0">
                <h3 className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-1.5">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="group">
                      <Link
                        href={link.url}
                        className="inline-flex items-center text-gray-600 transition-all hover:text-primary text-sm"
                      >
                        <span className="border-b border-transparent group-hover:border-primary/30">
                          {link.label}
                        </span>
                        <ArrowRight className="ml-1 h-3 w-3 opacity-0 transition-all -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social links */}
            <div className="col-span-1 xs:col-span-2 sm:col-span-1 mt-4 sm:mt-0">
              <h3 className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-1.5">
                Pratite nas
              </h3>
              <div className="flex flex-wrap sm:flex-col gap-4">
                {data.socialLinks.map((social, index) => {
                  const Icon = SocialIcon[social.platform as keyof typeof SocialIcon]
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-600 hover:text-primary transition-all"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100/80 text-gray-600 mr-2 transition-all hover:bg-primary/10 hover:text-primary shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="border-b border-transparent hover:border-primary/30 text-sm">
                        {social.platform === 'discord' ? 'Discord' : ''}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            {data.copyright} - {version}
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Pravila privatnosti
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Uvjeti korištenja
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.displayName = 'Footer'
