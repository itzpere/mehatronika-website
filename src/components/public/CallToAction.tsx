import { ArrowDown } from 'lucide-react'

export default function CallToAction() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center gap-8">
        <div className="flex-1 flex justify-end">
          <ArrowDown className="size-12 mt-4 text-primary animate-bounce hidden md:block" />
        </div>
        <div className="text-center max-w-2xl flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Imate predlog ili pitanje?</h3>
          <p className="text-gray-600">
            Javite nam se ako imate predlog za poboljšanje ili želite novu funkcionalnost
          </p>
        </div>
        <div className="flex-1">
          <ArrowDown className="size-12 mt-4 text-primary animate-bounce hidden md:block" />
        </div>
      </div>
    </div>
  )
}
