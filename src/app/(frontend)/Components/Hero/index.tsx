import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] bg-background px-4 py-32 flex items-center">
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/20 
        to-secondary/20 blur-3xl pointer-events-none"
      />

      <div className="container relative mx-auto text-center">
        <h1 className="mb-8 animate-fade-up text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Dobrodošli
          </span>{' '}
          <span className="inline-block animate-shake">👋</span>
        </h1>

        <p
          className="mx-auto mb-12 max-w-xl animate-fade-up [--animation-delay:200ms] 
          text-lg text-text/60 sm:text-xl md:max-w-2xl"
        >
          Besplatne skripte, projekti i zajednica za studente.
          <span className="block mt-2 text-text/80">Sve što ti treba na jednom mestu.</span>
        </p>

        <div className="flex items-center justify-center gap-4 animate-fade-up [--animation-delay:400ms]">
          <Button
            size="lg"
            className="group text-lg font-medium px-8 bg-primary hover:bg-primary/90
            transition-all duration-300"
          >
            Skripte
            <ArrowRight
              className="ml-2 h-5 w-5 transition-transform duration-300 
            group-hover:translate-x-1"
            />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
