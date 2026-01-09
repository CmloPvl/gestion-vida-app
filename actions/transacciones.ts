"use server"

import { salvarTransaccion, prisma } from "../lib/db-services"
import { revalidatePath } from "next/cache"

/**
 * 1. GUARDAR: Envía la venta a Supabase
 */
export async function crearTransaccion(data: any) {
  try {
    console.log("-----------------------------------------");
    console.log("🛒 NUEVA VENTA DETECTADA - URUGUAY 660");
    console.log("📦 Producto/Servicio:", data.nombre);
    console.log("💰 Monto: $", data.monto);
    
    const resultado = await salvarTransaccion(data);

    console.log("✅ GUARDADO EXITOSO EN SUPABASE. ID:", resultado.id);
    console.log("-----------------------------------------");

    revalidatePath("/finanzas");
    return { success: true };
    
  } catch (error: any) {
    console.error("❌ ERROR AL GUARDAR:", error.message);
    return { 
      success: false, 
      error: "No se pudo guardar la venta." 
    };
  }
}

/**
 * 2. LEER: Trae las ventas de una fecha específica
 * Si no se pasa fecha, por defecto usa "hoy".
 */
export async function obtenerTransaccionesPorFecha(fechaBase?: Date) {
  try {
    // Si no viene fecha, usamos el momento actual
    const fecha = fechaBase || new Date();
    
    // Configuramos el inicio del día (00:00:00)
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);

    // Configuramos el fin del día (23:59:59)
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);

    const transacciones = await prisma.transaccion.findMany({
      where: {
        fecha: {
          gte: inicioDia,
          lte: finDia,
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });

    return transacciones.map((t) => ({
      id: t.id,
      nombre: t.nombre,
      monto: Number(t.monto),
      categoria: String(t.clasificacion), 
      tipo: t.tipo as "INGRESO" | "GASTO",
      completado: t.completado,
    }));
  } catch (error) {
    console.error("❌ ERROR AL LEER FLUJOS POR FECHA:", error);
    return [];
  }
}

/**
 * 3. RESUMEN: Totales del mes
 */
export async function obtenerResumenMes() {
  try {
    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const transacciones = await prisma.transaccion.findMany({
      where: {
        fecha: {
          gte: primerDiaMes,
        },
      },
    });

    const ingresos = transacciones
      .filter(t => t.tipo === "INGRESO")
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const gastos = transacciones
      .filter(t => t.tipo === "GASTO")
      .reduce((sum, t) => sum + Number(t.monto), 0);

    return { ingresos, gastos };
  } catch (error) {
    console.error("❌ ERROR AL CALCULAR RESUMEN:", error);
    return { ingresos: 0, gastos: 0 };
  }
}

// En actions/transacciones.ts

export async function eliminarTransaccion(id: string) {
  try {
    await prisma.transaccion.delete({
      where: { id }
    });
    // Esto refresca la página automáticamente al borrar
    revalidatePath("/finanzas");
    return { success: true };
  } catch (error) {
    console.error("❌ ERROR AL ELIMINAR:", error);
    return { success: false };
  }
}