import { z } from "zod";

export const transaccionSchema = z.object({
  monto: z.coerce
    .number()
    .positive("El monto debe ser mayor a 0"),
  
  clasificacion: z.string().min(1, "Selecciona una categoría"),
  
  nombre: z.string().max(100, "Descripción muy larga").default("Sin descripción"),
  
  // Sincronizado con tu DB:
  tipo: z.enum(["INGRESO", "GASTO"]),

  // Añadimos método para que no falte en la DB
  metodo: z.string().default("EFECTIVO"),

  // Aseguramos que la fecha sea un objeto Date
  fecha: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()).default(() => new Date()),
});

export type TransaccionInput = z.infer<typeof transaccionSchema>;