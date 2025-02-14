import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-gray-400 placeholder:text-text/50 ring-primary/10 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow]',
        'focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-1 focus-visible:outline-primary/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-error/60 aria-invalid:ring-error/20 aria-invalid:focus-visible:ring-error/30 aria-invalid:focus-visible:outline-error/50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
