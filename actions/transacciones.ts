"use server"

import db from "@/prisma/client" 
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

/**
 * 1. GUARDAR: Crea un movimiento en la DB
 */
export async function crearTransaccion(data: {
  nombre: string;
  monto: number;
  tipo: string;      
  categoria: string; 
  metodo: string;
  fecha: Date;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    if (!data.nombre || data.monto <= 0 || !data.categoria) {
      return { success: false, error: "Datos incompletos o monto inválido." };
    }

    await db.transaccion.create({
      data: {
        nombre: data.nombre, 
        monto: data.monto,
        tipo: data.tipo,           
        clasificacion: data.categoria, 
        metodo: data.metodo,       
        fecha: data.fecha,   
        userId: session.user.id,
        completado: true
      },
    });

    revalidatePath("/finanzas");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ ERROR AL GUARDAR:", error);
    return { success: false, error: "Error interno de base de datos." };
  }
}

/**
 * 2. LEER: Trae los movimientos del día seleccionado
 */
export async function obtenerTransaccionesPorFecha(fechaBase: Date) {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const inicioDia = new Date(fechaBase);
    inicioDia.setHours(0, 0, 0, 0);
    
    const finDia = new Date(fechaBase);
    finDia.setHours(23, 59, 59, 999);

    return await db.transaccion.findMany({
      where: {
        userId: session.user.id,
        fecha: { gte: inicioDia, lte: finDia }
      },
      orderBy: { fecha: "desc" }
    });
  } catch (error) {
    console.error("❌ ERROR AL LEER:", error);
    return [];
  }
}

/**
 * 3. RESUMEN: Totales mensuales para el BalanceCard
 */
export async function obtenerResumenMes() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { ingresos: 0, gastos: 0 };

    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const transacciones = await db.transaccion.findMany({
      where: {
        userId: session.user.id,
        fecha: { gte: primerDiaMes }
      },
    });

    const ingresos = transacciones
      .filter(t => t.tipo === "INGRESO")
      .reduce((sum, t) => sum + t.monto, 0);

    const gastos = transacciones
      .filter(t => t.tipo === "GASTO")
      .reduce((sum, t) => sum + t.monto, 0);

    return { ingresos, gastos };
  } catch (error) {
    return { ingresos: 0, gastos: 0 };
  }
}

/**
 * 4. ELIMINAR: Borra una transacción específica
 */
export async function eliminarTransaccion(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    await db.transaccion.delete({
      where: { 
        id: id,
        userId: session.user.id
      }
    });

    revalidatePath("/finanzas");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ ERROR AL ELIMINAR:", error);
    return { success: false, error: "No se pudo eliminar." };
  }
}