"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { SessionProvider } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background/95">
          <div className="flex h-14 items-center border-b px-4">
            <SidebarTrigger />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </SessionProvider>
  )
}
