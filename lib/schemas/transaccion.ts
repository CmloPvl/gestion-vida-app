import { z } from "zod";

export const transaccionSchema = z.object({
  // Forma más segura y simple de validar números
  monto: z.coerce
    .number()
    .positive("El monto debe ser mayor a 0"),
    
  clasificacion: z.string().min(1, "Selecciona una categoría"),
  
  // Acepta string, lo hace opcional y si es null lo vuelve ""
  nombre: z.string().max(100, "Descripción muy larga").optional().default(""),
  
  // Dejamos el enum simple. Si el valor no es INCOME o EXPENSE, 
  // Zod lanzará un error por defecto que manejaremos en el Action.
  tipo: z.enum(["INCOME", "EXPENSE"]),
});

export type TransaccionInput = z.infer<typeof transaccionSchema>;