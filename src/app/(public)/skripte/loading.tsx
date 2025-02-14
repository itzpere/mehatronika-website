import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-medium text-text">Učitavanje...</p>
    </div>
  )
}
