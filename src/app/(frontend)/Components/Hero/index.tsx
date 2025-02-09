import React from 'react'
import { Button } from '@/components/ui/button'

const Hero: React.FC = () => {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center bg-white px-4 py-32">
      <div className="container mx-auto text-center">
        <h1 className="mb-8 text-black animate-fade-up bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-bold tracking-tight sm:text-7xl">
          Dobrodošli 👋
        </h1>
        <p className="mx-auto mb-8 max-w-2xl animate-fade-up text-lg text-gray-700 opacity-80">
          Besplatne skripte, projekti i zajednica za studente. Sve što ti treba na jednom mestu.{' '}
        </p>
        <Button className="font-bold">Skripte</Button>
      </div>
    </section>
  )
}

export default Hero
