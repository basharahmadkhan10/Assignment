"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export async function registerUser(data: FormData) {
  const email = data.get("email") as string
  const password = data.get("password") as string
  const name = data.get("name") as string

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email already exists" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: Role.BUYER,
      },
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to register account" }
  }
}
