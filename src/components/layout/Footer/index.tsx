import { Instagram, Facebook, Mail } from 'lucide-react'
import Link from 'next/link'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import type { Footer } from '@/payload-types'

const SocialIcon = {
  instagram: Instagram,
  facebook: Facebook,
  email: Mail,
}

export async function Footer() {
  const data = (await getCachedGlobal('footer', 1)()) as Footer

  return (
    <footer className="mt-auto w-full bg-white border-t-2 border-primary/10">
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {data.columns.map((column, index) => (
            <div key={index}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.url}
                      className="text-gray-600 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Pratite nas
            </h3>
            <ul className="space-y-2">
              {data.socialLinks &&
                data.socialLinks.map((social, index) => {
                  const Icon = SocialIcon[social.platform]
                  return (
                    <li key={index}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-600 transition-colors hover:text-primary"
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        <span>{social.platform}</span>
                      </a>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>

        <hr className="my-2 border-gray-200" />

        <div className="text-center text-sm text-gray-600">{data.copyright}</div>
      </div>
    </footer>
  )
}

Footer.displayName = 'Footer'
