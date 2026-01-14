// @ts-nocheck
import { PrismaClient } from '@prisma/client'

// 1. Configuramos el Singleton para evitar múltiples instancias en desarrollo
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 2. Exportamos la instancia única
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 3. Tu función de lógica (La mantenemos aquí por ahora, pero tipada)
export async function salvarTransaccion(data: any) {
  return await prisma.transaccion.create({
    data: {
      nombre: data.nombre,
      monto: Number(data.monto),
      tipo: data.tipo,
      clasificacion: data.clasificacion,
      fecha: new Date(),
      completado: true,
      // Nota: Aquí faltaría el userId para que sea multiusuario real
      // userId: data.userId 
    }
  })
}

// 4. Exportamos por defecto para que las Actions no den error de "no default export"
export default prisma;