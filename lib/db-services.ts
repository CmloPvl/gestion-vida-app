import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ASEGÚRATE DE QUE TENGA "export" AL PRINCIPIO
export async function salvarTransaccion(data: any) {
  try {
    return await prisma.transaccion.create({
      data: {
        nombre: data.nombre,
        monto: Number(data.monto),
        tipo: data.tipo,
        clasificacion: data.clasificacion,
        fecha: data.fecha ? new Date(data.fecha) : new Date(),
        completado: true,
      }
    })
  } catch (error: any) {
    console.error("❌ ERROR EN BASE DE DATOS:", error.message);
    throw error;
  }
}