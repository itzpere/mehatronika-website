import { ArrowUp } from 'lucide-react'

export default async function Page() {
  return (
    <div className="relative h-full">
      {/* strelica za pokazivanje kako se ukljucuje meni na mobilnom */}
      <ArrowUp
        className="absolute top-4 left-3.5 size-6 text-primary-light animate-bounce md:hidden"
        strokeWidth={3}
      />
    </div>
  )
}
