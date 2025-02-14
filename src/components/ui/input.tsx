import * as React from 'react'
import { cn } from '@/lib/utils/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-400 bg-white px-4 text-base text-gray-700',
        'placeholder:text-gray-400',
        'shadow-sm transition-all duration-200',
        'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
