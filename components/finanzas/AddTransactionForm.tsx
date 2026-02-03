"use client"

import React, { useState, useEffect } from "react"
import { crearTransaccion } from "@/actions/transacciones"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { ArrowUpCircle, ArrowDownCircle, Info, Landmark, Tag } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function AddTransactionForm({ 
  onSuccess, 
  fechaPreseleccionada, 
  tipoDefault = "GASTO" 
}: { 
  onSuccess?: () => void, 
  fechaPreseleccionada: Date,
  tipoDefault?: "INGRESO" | "GASTO"
}) {
  const [tipo, setTipo] = useState(tipoDefault)
  const queryClient = useQueryClient()

  useEffect(() => {
    setTipo(tipoDefault);
  }, [tipoDefault]);

  const mutation = useMutation({
    mutationFn: crearTransaccion,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
      queryClient.invalidateQueries({ queryKey: ["resumen-mes"] });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("¡Registro guardado!")
        if (onSuccess) onSuccess()
      } else {
        toast.error(result.error)
      }
    }
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const montoNumerico = Number(formData.get("monto"))

    if (montoNumerico <= 0) return toast.error("Monto inválido")

    const fechaFinal = new Date(fechaPreseleccionada)
    const ahora = new Date()
    fechaFinal.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds())

    mutation.mutate({
      nombre: (formData.get("nombre") as string) || "Sin descripción",
      monto: montoNumerico,
      tipo: tipo,
      clasificacion: tipo === "GASTO" ? "VIDA" : "INGRESO_EXTRA", 
      metodo: (formData.get("metodo") as string) || "EFECTIVO",
      fecha: fechaFinal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* EL SELECTOR SOLO SE MUESTRA SI NO VIENE DE UN BOTÓN ESPECÍFICO (Opcional) */}
      {/* Si quieres que desaparezca por completo para que no sea redundante: */}
      <div className="hidden">
        <input type="hidden" name="tipo" value={tipo} />
      </div>

      <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3 items-start">
        <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-[10px] leading-relaxed text-indigo-900 font-medium italic">
          {tipo === "INGRESO" 
            ? "Registrando un ingreso para hoy. Este dinero suma a tu flujo libre." 
            : "Registrando un gasto para hoy. Recuerda priorizar lo que realmente importa."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Tag className="absolute left-4 top-4 text-slate-300" size={16} />
          <Input name="nombre" placeholder="¿En qué se usó el dinero?" className="h-14 border-none bg-slate-50 rounded-2xl pl-11 font-bold text-slate-700" required />
        </div>
        
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-2xl">$</span>
          <Input name="monto" type="number" inputMode="decimal" placeholder="0" 
            className="h-24 text-5xl font-black border-none bg-slate-100/50 rounded-[2.5rem] pl-12 text-slate-900 focus:ring-2 ring-indigo-100" required 
          />
        </div>

        <div className="relative">
          <Landmark className="absolute left-3 top-4 text-slate-400" size={14} />
          <select name="metodo" className="w-full h-14 rounded-2xl bg-slate-50 border-none pl-10 pr-3 font-bold text-sm text-slate-600 outline-none appearance-none">
            <option value="EFECTIVO">💵 Efectivo</option>
            <option value="TARJETA">💳 Débito/Crédito</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending}
        className={`w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-[11px] text-white shadow-xl transition-all active:scale-95 ${tipo === 'INGRESO' ? 'bg-emerald-600' : 'bg-slate-900'}`}
      >
        {mutation.isPending ? "Guardando..." : `Confirmar ${tipo}`}
      </Button>
    </form>
  )
}