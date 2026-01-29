import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .trim()
    .toLowerCase(),
    
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[0-9]/, "Debe tener al menos un número"),

  // Campo nuevo para la confirmación
  confirmPassword: z.string().optional().or(z.literal('')),
    
  name: z
    .string()
    .min(3, "El nombre debe ser más largo")
    .max(50, "El nombre es demasiado largo")
    .optional()
    .or(z.literal('')),
})
.refine((data) => {
  // Solo validamos si confirmPassword tiene contenido (es decir, estamos en Registro)
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"], // El error aparecerá debajo del segundo campo
});

export type AuthFormData = z.infer<typeof authSchema>;