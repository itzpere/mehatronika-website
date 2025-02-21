import { ArrowDown } from 'lucide-react'

export default function CallToAction() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        <div className="flex-1 flex justify-end">
          <ArrowDown className="size-8 md:size-12 text-primary animate-bounce hidden md:block" />
        </div>
        <div className="text-center max-w-xs md:max-w-2xl flex-shrink-0">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Imate predlog ili pitanje?
          </h3>
          <p className="text-sm md:text-base text-gray-600">
            Javite nam se ako imate predlog za poboljšanje ili želite novu funkcionalnost
          </p>
        </div>
        <div className="flex-1 flex justify-center md:justify-start">
          <ArrowDown className="size-8 md:size-12 text-primary animate-bounce block" />
        </div>
      </div>
    </div>
  )
}
