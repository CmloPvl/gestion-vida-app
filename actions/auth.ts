"use server"

import prisma from "@/lib/prisma" // Corregido: Importamos desde nuestro singleton
import bcrypt from "bcryptjs"
import { authSchema } from "@/lib/validations/auth"
import { v4 as uuidv4 } from "uuid"
import { sendVerificationEmail } from "@/lib/mail"

export async function registrarUsuario(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries())
    const validation = authSchema.safeParse(rawData)

    if (!validation.success) {
      return { error: validation.error.issues[0].message }
    }

    const { email, password, name } = validation.data
    const normalizedEmail = email.toLowerCase();

    // Verificamos si ya existe
    const usuarioExistente = await prisma.user.findUnique({ 
      where: { email: normalizedEmail } 
    })

    if (usuarioExistente) {
      return { error: "Este correo electrónico ya está en uso" }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // 1. Crear el usuario y el token en una transacción (Todo o nada)
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hora

    await prisma.$transaction(async (tx) => {
      // Crear usuario
      await tx.user.create({
        data: {
          name: name || null,
          email: normalizedEmail,
          password: hashedPassword,
        },
      })

      // Limpiar tokens viejos y crear el nuevo
      await tx.verificationToken.deleteMany({ where: { email: normalizedEmail } })
      await tx.verificationToken.create({
        data: { email: normalizedEmail, token, expires }
      })
    })

    // 2. Enviar email (fuera de la transacción para no bloquear la DB si el mail tarda)
    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (error) {
      console.error("Error al enviar email:", error)
      return { error: "Cuenta creada, pero hubo un problema al enviar el correo. Intenta solicitar un nuevo link de acceso." }
    }

    return { success: true }

  } catch (error: any) {
    if (error.code === 'P2002') return { error: "El email ya está registrado." }
    console.error("❌ Error crítico en registro:", error)
    return { error: "Ocurrió un error interno. Inténtalo más tarde." }
  }
}