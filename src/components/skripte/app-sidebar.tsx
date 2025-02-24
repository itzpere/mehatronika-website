import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
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
import { getAllFolders } from './file-utils'

interface TreeNode {
  title: string
  url: string
  items?: TreeNode[]
}

async function getNavItems() {
  const folders = await getAllFolders()
  const tree: TreeNode[] = []

  // Build tree structure
  folders.forEach((folder) => {
    const path = folder.currentPath.split('/')
    let current = tree
    path.forEach((segment, index) => {
      if (!segment) return // Skip empty segments

      const existing = current.find((node) => node.title === segment)
      if (existing) {
        current = existing.items || []
      } else {
        const newNode = {
          title: segment,
          url: path.slice(0, index + 1).join('/') || '/',
          items: [],
        }
        current.push(newNode)
        current = newNode.items!
      }
    })
  })

  return tree
}
export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMain = await getNavItems()

  return (
    <Sidebar {...props} className="top-20 z-40 py-4">
      <SidebarHeader>
        {/* TODO: last updated section*/}
        {/* <SearchForm /> */}
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
                                      <Link href={'/skripte/' + deepItem.url}>
                                        {deepItem.title}
                                      </Link>
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
