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

interface HeaderProps {
  path?: string
}

export function Header({ path }: HeaderProps) {
  const segments = path?.split('/').filter(Boolean) || []

  return (
    <header className="sticky top-0.5 flex flex-col z-50 bg-background border-b px-4 shadow-sm">
      <div className="h-16 flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/skripte">Skripte</BreadcrumbLink>
            </BreadcrumbItem>

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
    </header>
  )
}
