'use client'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Loader2 } from 'lucide-react'
import { submitContactForm } from './submit'

const Kontakt: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await submitContactForm({ name, email, message })

      if (result.success) {
        toast.success('Poruka uspešno poslata!')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        toast.error(result.error || 'Došlo je do greške. Pokušajte ponovo.')
      }
    } catch (_error) {
      toast.error('Došlo je do greške. Pokušajte ponovo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold text-text">Kontaktirajte nas</h2>
          <p className="mb-8 text-gray-600">
            Imate pitanje? Pošaljite nam poruku i odgovorićemo vam u najkraćem roku.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ime
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vaše ime"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vasa@email.com"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Poruka
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Vaša poruka..."
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Slanje...
              </>
            ) : (
              'Pošalji poruku'
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default Kontakt
