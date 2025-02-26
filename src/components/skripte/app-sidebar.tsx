import { ChevronRight, FolderOpen, BookOpen } from 'lucide-react'
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
    <Sidebar {...props} className="top-20 z-40 py-4 shadow-sm">
      <SidebarHeader className="px-4">
        <div className="flex items-center gap-2 mb-2 animate-fade-up">
          <div className="p-2 rounded-md bg-sidebar-accent">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-medium">Skripte</h2>
        </div>
        <p
          className="text-xs text-muted-foreground pb-2 animate-fade-up"
          style={{ '--animation-delay': '0.1s' } as React.CSSProperties}
        >
          Pronađi i pregledaj materijale za učenje
        </p>
      </SidebarHeader>

      <SidebarContent className="gap-2">
        <SidebarMenu>
          {navMain.map((item, index) => (
            <div
              key={item.title}
              className="group animate-fade-up"
              style={{ '--animation-delay': `${0.15 + index * 0.05}s` } as React.CSSProperties}
            >
              <SidebarMenuButton
                disabled={true}
                className="text-primary font-semibold flex items-center gap-2 pl-4"
              >
                <FolderOpen className="w-4 h-4" />
                {item.title}
              </SidebarMenuButton>

              <SidebarMenuItem>
                {item.items && item.items.length > 0 && (
                  <SidebarMenuSub>
                    {item.items
                      .slice()
                      .reverse() //da bi pocelo od letnjeg semestra
                      .map((subItem, subIndex) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Collapsible className="group/subcollapsible w-full">
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton className="justify-between hover:bg-sidebar-accent/50 transition-colors">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-sidebar-border group-hover:bg-primary transition-colors"></div>
                                  {subItem.title}
                                </div>
                                {subItem.items && subItem.items.length > 0 && (
                                  <ChevronRight className="ml-2 shrink-0 w-4 h-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90" />
                                )}
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>

                            {subItem.items && subItem.items.length > 0 && (
                              <CollapsibleContent
                                className="animate-fade-up"
                                style={{ '--animation-delay': '0.05s' } as React.CSSProperties}
                              >
                                <SidebarMenuSub>
                                  {subItem.items
                                    .slice()
                                    .reverse()
                                    .map((deepItem) => (
                                      <SidebarMenuSubItem key={deepItem.title}>
                                        <SidebarMenuSubButton
                                          asChild
                                          className="h-auto min-h-[1.75rem] py-1.5 whitespace-normal hover:bg-sidebar-accent/60 transition-all hover:pl-1 group/item"
                                        >
                                          <Link
                                            href={'/skripte/' + deepItem.url}
                                            className="flex items-start w-full pr-2"
                                            title={deepItem.title}
                                          >
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

        <div
          className="mt-4 px-4 py-3 border border-sidebar-border rounded-lg mx-3 bg-sidebar-accent/30 animate-fade-up"
          style={{ '--animation-delay': '0.3s' } as React.CSSProperties}
        >
          <p className="text-xs text-muted-foreground">
            Materijali se organizuju po godinama i semestrima. Klikni da bi započeo pregled.
          </p>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
