import { ArrowRight, BookOpen, Users, Book, Code, HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[100vh] pt-40 bg-background px-4 py-8 md:py-16 flex items-center overflow-hidden">
      {/* Mobile-optimized background with dynamic gradient layers */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 md:w-80 h-48 md:h-80 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 right-20 w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto text-center px-2 md:px-4">
        {/* Mobile-optimized heading */}
        <h1 className="mb-4 md:mb-6 text-5xl  font-extrabold tracking-tight sm:text-7xl md:text-8xl animate-fade-up perspective-text">
          <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent drop-shadow-sm">
            Dobrodošli
          </span>{' '}
          <span className="inline-block md:inline-block animate-wave origin-bottom-right">
            👋
          </span>{' '}
        </h1>

        {/* Mobile-optimized tagline */}
        <p className="mx-auto mb-6 md:mb-10 max-w-xl animate-fade-up [--animation-delay:200ms] text-base md:text-lg text-text/70 sm:text-xl md:max-w-2xl">
          Besplatne skripte, projekti i zajednica za studente.
          <span className="block mt-2 md:mt-3 text-lg md:text-xl font-semibold text-text/90 bg-gradient-to-r from-primary/20 to-secondary/20 py-2 rounded-md">
            Sve što ti treba na jednom mestu.
          </span>
        </p>

        {/* Mobile-optimized CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-fade-up [--animation-delay:400ms]">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto group text-base md:text-lg font-medium px-6 md:px-8 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            <Link href="/skripte" className="flex items-center justify-center">
              <BookOpen className="mr-2 h-4 md:h-5 w-4 md:w-5" />
              Skripte
              <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto group text-base md:text-lg font-medium px-6 md:px-8 py-3 border-secondary/50 hover:bg-secondary/50 transition-all duration-300 hover:border-secondary"
          >
            <Link href="/login" className="flex items-center justify-center">
              <Users className="mr-2 h-4 md:h-5 w-4 md:w-5" />
              Pridruži se zajednici
            </Link>
          </Button>
        </div>
        {/* TODO: napravi da dugme nesto radi */}
        {/* Mobile-optimized feature highlights */}
        <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-up [--animation-delay:600ms]">
          {[
            { title: 'Relevantni materijali', icon: Book, desc: 'Ažurne skripte i primeri' },
            { title: 'Praktični projekti', icon: Code, desc: 'Stvarni primeri primene' },
            { title: 'Podrška studenata', icon: HeartHandshake, desc: 'Pomoć kad zatreba' },
          ].map((item, i) => (
            <div
              key={i}
              className="group p-4 md:p-6 bg-background/50 backdrop-blur-sm border-2 border-border/50 rounded-lg hover:border-primary/30 transition-all hover:bg-background/80 hover:shadow-lg hover:shadow-primary/5"
            >
              <item.icon className="mx-auto mb-2 md:mb-3 h-6 md:h-8 w-6 md:w-8 text-primary/70 group-hover:text-primary transition-colors" />
              <h3 className="text-lg md:text-xl font-medium text-text/90 mb-1 md:mb-2">
                {item.title}
              </h3>
              <p className="text-text/60 text-xs md:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}

export default Hero
