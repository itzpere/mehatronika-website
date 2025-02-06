import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Counter from './Counter'

//TODO: nabavi bolje slike za ovaj deo
//TODO: dodaj logiku za broj skripti
const Skripte: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3 max-w-6xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="relative h-48 w-64 transform -rotate-6 transition-transform hover:-rotate-3">
            <Image
              src="/images/notebook.webp"
              alt="Stack of academic materials"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <Counter end={156} />
            <h2 className="text-3xl font-bold text-text">dostupnih skripti</h2>
          </div>
          <p className="text-gray-600">Podeli svoje znanje i pomogni drugima.</p>
          <Link
            href="/skripte/upload"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:scale-105"
          >
            {/* TODO: ako je auth korisnik, onda: posalji na link za upload else uradi kao dialaog u smislu kao ulogujte se zbog toga i toga i onda ih odvedi na login strranicu */}
            Podeli svoje skripte
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-64 w-64 transform rotate-6 transition-transform hover:rotate-3">
            <Image
              src="/images/notebook.webp"
              alt="Stack of notes and papers"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skripte
