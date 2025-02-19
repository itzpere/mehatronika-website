'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'
import NewsletterForm from './components/form'
import { subscribeToNewsletter } from './libs/post'

//FIXME: implement user auth functionality to link to user acc

const MailSubscription = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const handleSubmit = async (email: string, years: number[], subscribeToBoard: boolean) => {
    const result = await subscribeToNewsletter(email, years, subscribeToBoard)
    if (!result.success && result.warn) return { success: true, warn: result.warn }
    if (!result.success) throw new Error(result.error)
    return result
  }

  const containerClasses = `
    relative rounded-2xl border border-gray-200/50 bg-background/95 p-8 shadow-xl 
    backdrop-blur-md transition-all duration-300 hover:border-primary/10 hover:shadow-primary/5
  `

  const titleClasses = `
    ${inView ? 'animate-fade-up' : ''} 
    bg-gradient-to-r from-primary via-primary/80 to-secondary 
    bg-clip-text pb-2 text-3xl font-bold text-transparent sm:text-4xl md:text-5xl
  `

  const descriptionClasses = `
    mx-auto mb-8 mt-4 max-w-xl ${inView ? 'animate-fade-up' : ''} 
    text-lg text-text/60 motion-safe:animate-fade-up
  `

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16">
      <div className="absolute inset-0 opacity-40">
        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
      </div>

      <div ref={ref} className={containerClasses}>
        <div className="text-center">
          <h2 className={titleClasses}>Prijavite se na naš Newsletter</h2>
          <p
            className={descriptionClasses}
            style={inView ? ({ '--animation-delay': '200ms' } as React.CSSProperties) : {}}
          >
            Dobijajte obaveštenja o novim skriptama i rezultatima ispita
          </p>
        </div>

        <div
          className={inView ? 'animate-fade-up' : ''}
          style={inView ? ({ '--animation-delay': '400ms' } as React.CSSProperties) : {}}
        >
          <NewsletterForm onSubmit={handleSubmit} />
        </div>
      </div>
    </section>
  )
}

export default MailSubscription
