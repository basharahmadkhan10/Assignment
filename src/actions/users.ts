"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    }
  })
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !currentStatus },
    })
    
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update user status" }
  }
}
