"use client"

import { LogOut, Package, ShoppingCart, LayoutDashboard } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { NotificationBell } from "@/components/NotificationBell"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const items = [
    {
      title: "Dashboard",
      url: isAdmin ? "/dashboard/overview" : "/dashboard/quotation",
      icon: LayoutDashboard,
      visible: true,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: LayoutDashboard,
      visible: isAdmin,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Package,
      visible: isAdmin,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
      visible: true,
    },
    {
      title: "Create Quotation",
      url: "/dashboard/quotation",
      icon: ShoppingCart,
      visible: !isAdmin,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold tracking-tight">AasaMedChem</h2>
          <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
        </div>
        {!isAdmin && <NotificationBell />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.visible)
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
