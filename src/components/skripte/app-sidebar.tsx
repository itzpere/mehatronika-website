import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { davClient } from '@/lib/utils/webdav'
import { SearchForm } from './search-form'

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
  path: string = `${process.env.WEBDAV_DEFAULT_FOLDER}`,
): Promise<NavItem[]> {
  try {
    const files = (await davClient.getDirectoryContents(path)) as WebDavFile[]

    if (!files) {
      console.error('Error: davClient.getDirectoryContents returned null or undefined')
      return [] // Return an empty array to prevent further errors
    }

    const navItems: NavItem[] = []

    for (const file of files) {
      if (file.type === 'directory') {
        const items = await getWebDavStructure(file.filename)
        navItems.push({
          title: file.basename,
          url: `/skripte/${file.filename}`,
          items,
        })
      } else {
        navItems.push({
          title: file.basename,
          url: `/skripte/${file.basename}`,
        })
      }
    }

    return navItems
  } catch (error) {
    console.error('Error fetching WebDAV structure:', error)
    return [] // Return an empty array to prevent further errors
  }
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMain = await getWebDavStructure()

  return (
    <Sidebar {...props} className="top-20 z-40 py-4">
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {navMain.map((item) => (
          <Collapsible key={item.title} className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}
                  {item.items && (
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              {item.items && (
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              )}
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
