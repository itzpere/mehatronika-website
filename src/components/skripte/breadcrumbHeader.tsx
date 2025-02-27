'use client'

import { ChevronRight, Home, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
  const decodedSegment = decodeURIComponent(segment)

  return (
    <>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage className="font-medium text-foreground px-2 py-1 rounded-md bg-muted/40">
            {decodedSegment}
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink
            href={href}
            className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/30 px-2 py-1 rounded-md hover:bg-muted/40"
          >
            {decodedSegment}
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  )
}

export function BreadcrumbHeader({ className }: HeaderProps) {
  const pathname = usePathname()
  const segments = pathname?.split('/').slice(2).filter(Boolean) || []
  const currentSegment = segments[segments.length - 1]
  const visibleSegments = segments.length > 3 ? segments.slice(-3) : segments

  return (
    <div
      className={cn(
        'flex flex-col z-50 bg-gradient-to-b from-background to-background/90 backdrop-blur-[2px] border-b px-4 shadow-sm',
        'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent',
        className,
      )}
    >
      <div className="h-16 flex items-center gap-2">
        <SidebarTrigger
          className="-ml-1 hover:bg-muted/60 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </SidebarTrigger>

        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb className="hidden md:block overflow-hidden">
          <BreadcrumbList className="animate-fade-in">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/skripte"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.length > 3 && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/skripte/${segments[0]}`}
                    className="hover:text-primary transition-colors px-1"
                  >
                    <span className="flex items-center gap-1">
                      {decodeURIComponent(segments[0])}
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">...</span>
                    </span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            {visibleSegments.map((segment, index) => (
              <BreadcrumbSegment
                key={segment}
                segment={segment}
                href={`/skripte/${segments.slice(0, segments.length - visibleSegments.length + index + 1).join('/')}`}
                isLast={index === visibleSegments.length - 1}
              />
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
