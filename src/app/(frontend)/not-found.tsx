'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-24">
      <div className="text-center">
        <h1 className="mb-4 bg-primary bg-clip-text text-6xl font-bold text-transparent">404</h1>
        <h2 className="mb-8 text-2xl font-semibold text-text">Stranica nije pronađena</h2>
        <p className="mb-8 text-gray-600">
          Izgleda da stranica koju tražite ne postoji ili je premeštena.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" />
          Nazad na početnu
        </Link>
      </div>
    </div>
  )
}
