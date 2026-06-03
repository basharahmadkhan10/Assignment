"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return []

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return []

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })
}

export async function markNotificationRead(notificationId: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function createNotification(userId: string, message: string) {
  await prisma.notification.create({
    data: {
      userId,
      message,
    }
  })
}
