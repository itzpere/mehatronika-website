'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  className?: string
}

function BreadcrumbSegment({
  segment,
  href,
  isLast,
}: {
  segment: string
  href: string
  isLast: boolean
}) {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={href}>{decodeURIComponent(segment)}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  )
}

export function BreadcrumbHeader({ className }: HeaderProps) {
  const pathname = usePathname()
  const segments = pathname?.split('/').slice(2).filter(Boolean) || []
  const currentSegment = segments[segments.length - 1]

  return (
    <div className={cn('flex flex-col z-50 bg-background border-b px-4 shadow-sm', className)}>
      <div className="h-16 flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <div className="md:hidden text-sm font-medium truncate">
          {currentSegment && decodeURIComponent(currentSegment)}
        </div>

        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            {segments.map((segment, index) => (
              <BreadcrumbSegment
                key={segment}
                segment={segment}
                href={`/skripte/${segments.slice(0, index + 1).join('/')}`}
                isLast={index === segments.length - 1}
              />
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
