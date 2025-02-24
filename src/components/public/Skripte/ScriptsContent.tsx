import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Counter from './Counter'

export async function ScriptsContent() {
  const payload = await getPayload({
    config: configPromise,
  })

  const numberOfFiles = await payload.count({
    collection: 'files',
  })
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <span className="text-5xl font-bold">
          <Counter end={numberOfFiles.totalDocs} />
        </span>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          dostupnih skripti
        </h2>
      </div>

      <p className="text-lg text-text/60">Podeli svoje znanje i pomogni drugima.</p>

      <Link
        href="/skripte/upload"
        className="group inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-primary/20 active:scale-95"
      >
        <span>Podeli svoje skripte</span>
        <svg
          className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </Link>
    </div>
  )
}
