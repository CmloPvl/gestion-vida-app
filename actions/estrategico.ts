"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { estrategicoSchema } from "@/lib/schemas/estrategico";

export async function createEstrategicoItem(data: {
  nombre: string;
  monto: number;
  subMonto?: number;
  seccion: "ingresos" | "gastos" | "activos" | "pasivos";
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado" };

  // Validación con safeParse
  const result = estrategicoSchema.safeParse(data);

  if (!result.success) {
    // Acceso seguro a los mensajes de error de Zod
    return { 
      success: false, 
      error: result.error.issues[0]?.message || "Datos inválidos" 
    };
  }

  try {
    await prisma.estrategicoItem.create({
      data: {
        nombre: result.data.nombre,
        monto: result.data.monto,
        subMonto: result.data.subMonto || 0,
        seccion: data.seccion,
        userId: session.user.id,
      },
    });

    revalidatePath("/finanzas/estrategico");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al guardar en la base de datos" };
  }
}

export async function getEstrategicoItems() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return await prisma.estrategicoItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteEstrategicoItem(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado" };

  try {
    await prisma.estrategicoItem.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/finanzas/estrategico");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar" };
  }
}