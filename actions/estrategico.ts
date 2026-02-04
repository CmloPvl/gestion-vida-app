"use server";

// Cambiamos el import para usar el archivo limpio de hoy
import { prisma } from "@/lib/db-services"; 
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
  
  // Si aún no terminas el "candado" en auth.ts, esto podría dar null.
  // Pero lo dejamos así porque es la forma correcta para producción.
  if (!session?.user?.id) return { success: false, error: "No autorizado" };

  const result = estrategicoSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Datos inválidos" };
  }

  try {
    // Usamos 'estrategicoItem' que es como se llama en tu schema.prisma
    await prisma.estrategicoItem.create({
      data: {
        nombre: result.data.nombre,
        monto: result.data.monto,
        subMonto: result.data.subMonto || 0,
        seccion: data.seccion,
        userId: session.user.id,
      },
    });

    revalidatePath("/finanzas");
    revalidatePath("/finanzas/estrategico");
    return { success: true };
  } catch (error) {
    console.error("Error en DB:", error);
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
      where: { 
        id: id,
        userId: session.user.id // RLS: Solo borra si le pertenece al usuario
      },
    });
    
    revalidatePath("/finanzas");
    revalidatePath("/finanzas/estrategico");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar" };
  }
}