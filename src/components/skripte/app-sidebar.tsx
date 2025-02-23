import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { cache } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { withCache } from '@/lib/utils/cache'
import { publicDavClient } from '@/lib/utils/public-webdav'
import { SearchForm } from './search-form'

export const revalidate = 3600 // 1 hour

interface WebDavFile {
  basename: string
  filename: string
  type: 'directory' | 'file'
}

interface NavItem {
  title: string
  url: string
  items?: NavItem[]
}
// env folder for sidebar

async function getWebDavStructure(
  path: string = `${process.env.WEBDAV_DEFAULT_FOLDER || '/'}`,
): Promise<NavItem[]> {
  return withCache(`webdav:${path}`, async () => {
    const files = (await publicDavClient.getDirectoryContents(path)) as WebDavFile[]
    const navItems: NavItem[] = []

    await Promise.all(
      files.map(async (file) => {
        if (file.type === 'directory') {
          const subitems = await getWebDavStructure(file.filename)
          navItems.push({
            title: file.basename,
            url: `/skripte/${file.filename}`,
            items: subitems,
          })
        }
      }),
    )

    return navItems.sort((a, b) => a.title.localeCompare(b.title))
  })
}

const getNavItems = cache(async () => {
  return getWebDavStructure()
})

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMain = await getNavItems()

  return (
    <Sidebar {...props} className="top-20 z-40 py-4">
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarMenu>
          {navMain.map((item) => (
            <div key={item.title} className="group">
              <SidebarMenuButton disabled={true} className="text-text">
                {item.title}
              </SidebarMenuButton>
              <SidebarMenuItem>
                {item.items && item.items.length > 0 && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <Collapsible className="group/subcollapsible w-full">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuSubButton className="justify-between">
                              {subItem.title}
                              {subItem.items && subItem.items.length > 0 && (
                                <ChevronRight className="ml-2 shrink-0 transition-transform group-data-[state=open]/subcollapsible:rotate-90" />
                              )}
                            </SidebarMenuSubButton>
                          </CollapsibleTrigger>
                          {subItem.items && subItem.items.length > 0 && (
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {subItem.items.map((deepItem) => (
                                  <SidebarMenuSubItem key={deepItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      className="h-auto min-h-[1.75rem] py-1.5 whitespace-normal"
                                    >
                                      <Link href={deepItem.url}>{deepItem.title}</Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
