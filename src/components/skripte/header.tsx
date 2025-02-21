'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
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

export function BreadcrumbHeader({ className }: HeaderProps) {
  const pathname = usePathname()
  const cleanPath = pathname?.split('/').slice(2).join('/') || ''
  const segments = cleanPath.split('/').filter(Boolean)
  return (
    <div className={cn('flex flex-col z-50 bg-background border-b px-4 shadow-sm', className)}>
      <div className="h-16 flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const href = `/skripte/${segments.slice(0, index + 1).join('/')}`
              return (
                <React.Fragment key={segment}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem className="hidden md:block">
                    {index === segments.length - 1 ? (
                      <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{decodeURIComponent(segment)}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
