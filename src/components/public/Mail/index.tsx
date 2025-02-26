'use client'

import { Bell, CheckCircle, Clock, Zap } from 'lucide-react'
import React from 'react'
import { useInView } from 'react-intersection-observer'
import NewsletterForm from './components/form'
import { subscribeToNewsletter } from './libs/post'

const MailSubscription = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const handleSubmit = async (email: string, years: number[], subscribeToBoard: boolean) => {
    const result = await subscribeToNewsletter(email, years, subscribeToBoard)
    if (!result.success && result.warn) return { success: true, warn: result.warn }
    if (!result.success) throw new Error(result.error)
    return result
  }

  const benefits = [
    { icon: Zap, text: 'Rezultati ispita čim izađu' },
    { icon: Clock, text: 'Uštedite vreme na osvežavanju stranice' },
    { icon: Bell, text: 'Obaveštenja o svim izmenama rezultata' },
    { icon: CheckCircle, text: 'Besplatno i bez spama' },
  ]

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-24">
      <div className="absolute inset-0 opacity-40">
        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
      </div>

      <div
        ref={ref}
        className="relative rounded-3xl border border-primary/10 bg-background/95 p-6 md:p-10 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

        <div
          className={`relative z-10 grid md:grid-cols-[1fr,1.2fr] gap-8 items-center ${inView ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <div className="text-left">
            <h2 className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text pb-2 text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              Saznajte rezultate ispita prvi
            </h2>
            <p className="my-4 text-lg text-text/70">
              Pridružite se <span className="font-semibold text-primary">kolegama</span> koji već
              dobijaju rezultate ispita direktno u inbox -{' '}
              <span className="italic">bez stalnog osvežavanja stranice</span>
            </p>

            <ul className="mt-6 space-y-3">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-3 ${inView ? 'animate-fade-in' : 'opacity-0'}`}
                  style={inView ? { animationDelay: `${index * 150}ms` } : {}}
                >
                  <benefit.icon className="h-5 w-5 text-primary" />
                  <span className="text-text/80">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`rounded-xl bg-gradient-to-br from-secondary/5 to-primary/5 p-6 border border-primary/10 shadow-lg ${inView ? 'animate-fade-in' : 'opacity-0'}`}
            style={inView ? { animationDelay: '300ms' } : {}}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-text/90">Prijavite se za obaveštenja</h3>
              <p className="text-text/70 text-sm mt-1">Više nikad nećete propustiti rezultate</p>
            </div>
            <NewsletterForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MailSubscription
