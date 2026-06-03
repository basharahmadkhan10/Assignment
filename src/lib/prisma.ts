import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Pool, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const getPrisma = () => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }
  
  neonConfig.webSocketConstructor = ws
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  
  const prisma = new PrismaClient({ adapter })
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
  return prisma
}

export const prisma = getPrisma()
