'use client'

export default function Loading() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )
}
