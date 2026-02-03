import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// BORRA TODO LO DEMÁS DE ESTE ARCHIVO. 
// No necesitamos "salvarTransaccion" aquí porque causaba errores de tipos en Vercel.