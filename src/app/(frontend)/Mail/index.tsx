'use client'
import React from 'react'
import NewsletterForm from './components/form'
import { subscribeToNewsletter } from './utils/post'

const MailSubscription = () => {
  const handleSubmit = async (email: string, years: number[], subscribeToBoard: boolean) => {
    const result = await subscribeToNewsletter(email, years, subscribeToBoard)

    if (!result.success && result.warn) {
      // Email already subscribed case
      return { success: true, warn: result.warn }
    }

    if (!result.success) {
      throw new Error(result.error)
    }

    return result
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mb-4 bg-primary bg-clip-text text-3xl font-bold text-transparent">
            Prijavite se na naš Newsletter
          </h2>
          <p className="mb-8 text-gray-600">
            Dobijajte obaveštenja o novim skriptama i rezultatima ispita
          </p>{' '}
        </div>
        <NewsletterForm onSubmit={handleSubmit} />
      </div>
    </section>
  )
}

export default MailSubscription
