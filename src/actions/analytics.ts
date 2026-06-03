"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getAdminAnalytics() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const [totalProducts, ordersByStatus, totalOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
    prisma.order.count(),
  ])

  // Format the orders data for the chart
  const orderStats = {
    PENDING: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
  }

  ordersByStatus.forEach((group) => {
    orderStats[group.status] = group._count._all
  })

  return {
    totalProducts,
    totalOrders,
    orderStats,
  }
}
