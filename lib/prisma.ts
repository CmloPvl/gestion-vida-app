import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Función de utilidad para transacciones rápidas.
 * IMPORTANTE: El userId es obligatorio para cumplir con el RLS de la DB.
 */
export async function salvarTransaccion(data: {
  nombre: string,
  monto: number,
  tipo: string,
  clasificacion: string,
  userId: string // <-- El candado: Sin ID no hay transacción
}) {
  return await prisma.transaccion.create({
    data: {
      nombre: data.nombre,
      monto: Number(data.monto),
      tipo: data.tipo,
      clasificacion: data.clasificacion,
      fecha: new Date(),
      completado: true,
      userId: data.userId 
    }
  })
}

export default prisma;