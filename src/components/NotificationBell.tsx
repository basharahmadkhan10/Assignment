"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { buttonVariants } from "@/components/ui/button"
import { getNotifications, markNotificationRead } from "@/actions/notifications"

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  async function fetchNotifs() {
    const data = await getNotifications()
    setNotifications(data)
  }

  useEffect(() => {
    fetchNotifs()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [])

  async function handleRead(id: string) {
    await markNotificationRead(id)
    fetchNotifs()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative" })}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive"></span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have {unreadCount} unread messages.
            </p>
          </div>
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notifications yet.</p>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`flex flex-col gap-1 p-2 rounded-md border ${notif.read ? 'bg-background' : 'bg-muted/50'}`}
                >
                  <p className="text-sm">{notif.message}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                    {!notif.read && (
                      <button 
                        onClick={() => handleRead(notif.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
