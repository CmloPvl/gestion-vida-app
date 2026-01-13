"use server"

import db from "@/prisma/client" 
import bcrypt from "bcryptjs"// Necesitarás instalarlo: npm install bcryptjs && npm install -D @types/bcryptjs

export async function registrarUsuario(formData: FormData) {
  console.log("¡Recibiendo datos en el servidor!");
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) return { error: "Faltan datos" }

  // 1. Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    // 2. Guardar en la base de datos
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true, user }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "El email ya está registrado" }
    }
    return { error: "Error al crear la cuenta" }
  }
}