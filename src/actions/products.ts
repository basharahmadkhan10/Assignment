"use server"

import { prisma } from "@/lib/prisma"
import { Dimension, HazardClass } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export type ProductCreateData = {
  name: string
  description?: string
  dimension: Dimension
  baseUnit: string
  basePrice: number
  stockQuantity: number
  storageCondition?: string
  hazardClass?: HazardClass
}

export async function createProduct(data: ProductCreateData) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.product.create({
    data,
  })

  revalidatePath("/dashboard/inventory")
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.product.delete({
    where: { id },
  })

  revalidatePath("/dashboard/inventory")
}
