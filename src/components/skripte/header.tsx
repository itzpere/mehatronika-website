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
  href?: string
  linkName?: string
  pageName?: string
}

export function Header({ href, linkName, pageName }: HeaderProps) {
  return (
    <header className="sticky top-0 flex z-40 bg-background/95 backdrop-blur h-16 items-center gap-2 border-b px-4 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {href && linkName && (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={href}>{linkName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
          {pageName && (
            <BreadcrumbItem>
              <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
