// @ts-nocheck
import { PrismaClient } from '@prisma/client'

// Esta es la única instancia que existirá
const prisma = new PrismaClient({
  log: ['error'],
})

export async function salvarTransaccion(data: any) {
  // Aquí la lógica de guardado vive aislada del resto del mundo
  return await prisma.transaccion.create({
    data: {
      nombre: data.nombre,
      monto: Number(data.monto),
      tipo: data.tipo,
      clasificacion: data.clasificacion,
      fecha: new Date(),
      completado: true,
    }
  })
}