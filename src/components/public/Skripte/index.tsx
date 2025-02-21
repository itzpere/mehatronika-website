import Image from 'next/image'
import { ScriptsContent } from './ScriptsContent'

export default function Skripte() {
  return (
    <section className="container relative mx-auto px-4 py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl" />
      </div>

      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Left Image */}
        <div className="hidden lg:flex items-center justify-center group">
          <div className="relative h-48 w-64 transform -rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-[1.02] hover:shadow-lg rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <Image
              src="/images/notebook.webp"
              alt="Stack of academic materials"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <ScriptsContent />

        {/* Right Image */}
        <div className="hidden lg:flex items-center justify-center group">
          <div className="relative h-64 w-64 transform rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-[1.02] hover:shadow-lg rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
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
