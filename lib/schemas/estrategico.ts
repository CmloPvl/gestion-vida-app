import { z } from "zod";

export const estrategicoSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  
  monto: z.coerce.number()
    .positive("El monto debe ser mayor a 0"),
  
  subMonto: z.coerce.number()
    .min(0, "No puede ser un valor negativo")
    .optional(),

  seccion: z.enum(["ingresos", "gastos", "activos", "pasivos"])
});