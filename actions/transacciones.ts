"use server"

import db from "@/prisma/client" 
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { transaccionSchema } from "@/lib/schemas/transaccion"

export async function crearTransaccion(rawData: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    // ASEGURAMOS QUE NADA LLEGUE COMO UNDEFINED ANTES DE PASAR POR ZOD
    const dataToValidate = {
      nombre: rawData.nombre || "Sin descripción",
      monto: Number(rawData.monto),
      tipo: rawData.tipo, // INGRESO o GASTO
      clasificacion: rawData.clasificacion,
      metodo: rawData.metodo || "EFECTIVO", // <--- Si falta, le ponemos EFECTIVO
      fecha: rawData.fecha ? new Date(rawData.fecha) : new Date(),
    };

    const validacion = transaccionSchema.safeParse(dataToValidate);

    if (!validacion.success) {
      // Si falla, imprimimos en consola para que tú veas qué campo falta
      console.error("❌ ZOD ERROR:", validacion.error.format());
      const errorMsg = validacion.error.issues[0]?.message || "Datos inválidos";
      return { success: false, error: errorMsg };
    }

    const data = validacion.data;

    await db.transaccion.create({
      data: {
        nombre: data.nombre, 
        monto: data.monto,
        tipo: data.tipo,           
        clasificacion: data.clasificacion, 
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
    return { success: false, error: "Error de servidor al guardar la transacción." };
  }
}

/**
 * EL RESTO DE TUS FUNCIONES (LEER, RESUMEN, ELIMINAR) ESTÁN PERFECTAS
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
    return { success: false, error: "No se pudo eliminar la transacción." };
  }
}