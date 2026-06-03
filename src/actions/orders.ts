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

  // Pre-validate stock
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    })
    if (!product) throw new Error("Product not found")
    if (Number(product.stockQuantity) < item.baseQuantity) {
      throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.baseQuantity}`)
    }
  }

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

  // Notify Admins
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" }
  })
  
  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        message: `New Order #${order.id.slice(-8)} placed by ${user.name || user.email}.`,
      }))
    })
  }

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

export async function updateOrderStatus(orderId: string, newStatus: "CONFIRMED" | "CANCELLED", userId: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return { error: "Order not found" }
    }

    await prisma.$transaction(async (tx) => {
      // 2. Check and Deduct inventory if CONFIRMED
      if (newStatus === "CONFIRMED") {
        for (const item of order.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          })
          
          if (!product) {
            throw new Error("Product not found")
          }
          
          if (Number(product.stockQuantity) < Number(item.baseQuantity)) {
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.baseQuantity}`)
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.baseQuantity
              }
            }
          })
        }
      }

      // 1. Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      })

      // 3. Create Notification for the Buyer
      await tx.notification.create({
        data: {
          userId: userId,
          message: `Your Order #${orderId.slice(-8)} has been ${newStatus.toLowerCase()}.`,
        }
      })
    })

    revalidatePath("/dashboard", "layout")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update order status or deduct inventory" }
  }
}
