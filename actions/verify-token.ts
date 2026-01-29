"use server"

import db from "@/prisma/client"

export async function verificarTokenEmail(token: string) {
  try {
    // 1. Buscar si el token existe
    const tokenExistente = await db.verificationToken.findUnique({
      where: { token }
    });

    if (!tokenExistente) {
      return { error: "El link no es válido o ya fue usado." };
    }

    // 2. Revisar si expiró
    const haExpirado = new Date(tokenExistente.expires) < new Date();
    if (haExpirado) {
      return { error: "El link ha expirado. Por favor, regístrate de nuevo." };
    }

    // 3. Buscar al usuario
    const usuario = await db.user.findUnique({
      where: { email: tokenExistente.email }
    });

    if (!usuario) {
      return { error: "El usuario no existe." };
    }

    // 4. ACTUALIZAR: Aquí abrimos el candado
    await db.user.update({
      where: { id: usuario.id },
      data: { 
        emailVerified: new Date(),
        email: tokenExistente.email, // Por seguridad
      }
    });

    // 5. Borrar el token para que no se use dos veces
    await db.verificationToken.delete({
      where: { id: tokenExistente.id }
    });

    return { success: "Email verificado correctamente." };

  } catch (error) {
    return { error: "Ocurrió un error inesperado al verificar." };
  }
}