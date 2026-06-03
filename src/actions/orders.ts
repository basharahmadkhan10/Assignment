"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export type OrderItemInput = {
  productId: string
  orderedQuantity: number
  orderedUnit: string
  baseQuantity: number
  calculatedPrice: number
}

export async function createOrder(items: OrderItemInput[], totalAmount: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // Get user id
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  
  if (!user) throw new Error("User not found")

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          orderedQuantity: item.orderedQuantity,
          orderedUnit: item.orderedUnit,
          baseQuantity: item.baseQuantity,
          calculatedPrice: item.calculatedPrice,
        }))
      }
    }
  })

  revalidatePath("/dashboard/quotation")
  
  return order
}

export async function getOrders() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  // Admins see all orders, sellers see only their own
  const whereClause = session.user.role === "ADMIN" ? {} : { userId: user?.id }

  return prisma.order.findMany({
    where: whereClause,
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  })
}
