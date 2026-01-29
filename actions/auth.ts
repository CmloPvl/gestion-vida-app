"use server"

import db from "@/prisma/client" 
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
    
    // Normalizar email a minúsculas para evitar duplicados por tipeo
    const normalizedEmail = email.toLowerCase();

    const usuarioExistente = await db.user.findUnique({ 
      where: { email: normalizedEmail } 
    })

    if (usuarioExistente) {
      return { error: "Este correo electrónico ya está en uso" }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // 1. Crear el usuario (se crea con emailVerified: null por defecto)
    await db.user.create({
      data: {
        name: name || null,
        email: normalizedEmail,
        password: hashedPassword,
      },
    })

    // 2. Generar Token de Verificación
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hora

    // Limpiar tokens antiguos del mismo email antes de crear uno nuevo
    await db.verificationToken.deleteMany({
      where: { email: normalizedEmail }
    }).catch(() => {}); 

    await db.verificationToken.create({
      data: { email: normalizedEmail, token, expires }
    })

    // 3. ENVIAR EMAIL REAL
    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (error) {
      console.error("Error al enviar email:", error)
      // Si falla el mail, borramos el token para que puedan reintentar o pedir otro
      return { error: "Cuenta creada, pero hubo un problema al enviar el correo. Por favor, intenta solicitar un nuevo link de acceso." }
    }

    // Retornamos éxito para que el Hook dispare el mensaje de Gmail y cierre el modal
    return { success: true }

  } catch (error: any) {
    if (error.code === 'P2002') return { error: "El email ya está registrado." }
    console.error("❌ Error crítico en registro:", error)
    return { error: "Ocurrió un error interno. Inténtalo más tarde." }
  }
}