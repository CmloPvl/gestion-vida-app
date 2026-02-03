"use server"

import db from "@/prisma/client" 
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { transaccionSchema } from "@/lib/schemas/transaccion"

export async function crearTransaccion(rawData: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const dataToValidate = {
      nombre: rawData.nombre || "Sin descripción",
      monto: Number(rawData.monto),
      tipo: rawData.tipo, 
      clasificacion: rawData.clasificacion,
      metodo: rawData.metodo || "EFECTIVO", 
      fecha: rawData.fecha ? new Date(rawData.fecha) : new Date(),
    };

    const validacion = transaccionSchema.safeParse(dataToValidate);

    if (!validacion.success) {
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
    revalidatePath("/finanzas/estrategico"); 
    return { success: true };
  } catch (error) {
    console.error("❌ ERROR AL GUARDAR:", error);
    return { success: false, error: "Error de servidor al guardar la transacción." };
  }
}

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
 * RESUMEN HÍBRIDO PROFESIONAL
 * Suma los movimientos del Pad + los items fijos del Estratégico
 */
export async function obtenerResumenMes(fechaReferencia: Date = new Date()) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { ingresos: 0, gastos: 0 };

    const userId = session.user.id;
    const inicioMes = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), 1);
    const finMes = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth() + 1, 0, 23, 59, 59);

    // Consulta consolidada
    const [transacciones, itemsEstrategicos] = await Promise.all([
      db.transaccion.findMany({ 
        where: { userId, fecha: { gte: inicioMes, lte: finMes } } 
      }),
      db.estrategicoItem.findMany({ 
        where: { userId, seccion: { in: ["ingresos", "gastos"] } } 
      })
    ]);

    // Suma del Pad (Registro Diario)
    const ingDiarios = transacciones.filter(t => t.tipo === "INGRESO").reduce((s, t) => s + t.monto, 0);
    const gasDiarios = transacciones.filter(t => t.tipo === "GASTO").reduce((s, t) => s + t.monto, 0);

    // Suma del Estratégico (Sueldo, Arriendo, etc)
    const ingFijos = itemsEstrategicos.filter(i => i.seccion === "ingresos").reduce((s, i) => s + i.monto, 0);
    const gasFijos = itemsEstrategicos.filter(i => i.seccion === "gastos").reduce((s, i) => s + i.monto, 0);

    return { 
      ingresos: ingDiarios + ingFijos, 
      gastos: gasDiarios + gasFijos
    };
  } catch (error) {
    console.error("❌ ERROR EN RESUMEN:", error);
    return { ingresos: 0, gastos: 0 };
  }
}

export async function eliminarTransaccion(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    await db.transaccion.delete({
      where: { id: id, userId: session.user.id }
    });

    revalidatePath("/finanzas");
    revalidatePath("/finanzas/estrategico");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar." };
  }
}