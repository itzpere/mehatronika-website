'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Counter from './Counter'

const Skripte: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="container relative mx-auto px-4 py-24 overflow-hidden">
      {/* Background gradient - more subtle */}
      <div className="absolute inset-0 opacity-25">
        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl" />
      </div>

      <div className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-3 max-w-6xl mx-auto">
        {/* Left Image - adjusted rotation and shadow */}
        <div className="flex items-center justify-center group animate-on-scroll opacity-0 translate-x-[-50px] transition-all duration-700">
          <div
            className="relative h-48 w-64 transform -rotate-3 transition-all duration-300 
            hover:rotate-0 hover:scale-[1.02] hover:shadow-lg rounded-xl overflow-hidden 
            bg-white/50 backdrop-blur-sm"
          >
            <Image
              src="/images/notebook.webp"
              alt="Stack of academic materials"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="text-center space-y-8 animate-on-scroll opacity-0 translate-y-[20px] transition-all duration-700 delay-300">
          <div className="space-y-4">
            <Counter end={156} />
            <h2
              className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 
              to-secondary bg-clip-text text-transparent"
            >
              dostupnih skripti
            </h2>
          </div>

          <p className="text-lg text-text/60">Podeli svoje znanje i pomogni drugima.</p>

          <Link
            href="/skripte/upload"
            className="group inline-flex items-center justify-center rounded-xl 
              bg-primary px-8 py-4 font-semibold text-white shadow-lg
              transition-all duration-300 hover:bg-primary/90 hover:scale-105 
              hover:shadow-primary/20 active:scale-95"
          >
            <span>Podeli svoje skripte</span>
            <svg
              className="ml-2 h-5 w-5 transition-transform duration-300 
                group-hover:translate-x-1"
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

        {/* Right Image - mirrored adjustments */}
        <div className="flex items-center justify-center group animate-on-scroll opacity-0 translate-x-[50px] transition-all duration-700">
          <div
            className="relative h-64 w-64 transform rotate-3 transition-all duration-300 
            hover:rotate-0 hover:scale-[1.02] hover:shadow-lg rounded-xl overflow-hidden
            bg-white/50 backdrop-blur-sm"
          >
            <Image
              src="/images/notebook.webp"
              alt="Stack of notes and papers"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skripte
