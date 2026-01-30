"use client"

import React, { useState } from "react"
import { crearTransaccion } from "@/actions/transacciones"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ArrowUpCircle, ArrowDownCircle, Info, Landmark, Tag } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function AddTransactionForm({ onSuccess, fechaPreseleccionada }: { onSuccess?: () => void, fechaPreseleccionada: Date }) {
  const [tipo, setTipo] = useState("GASTO")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: crearTransaccion,
    onMutate: async (nuevaTransaccion) => {
      await queryClient.cancelQueries({ queryKey: ["transacciones"] })
      const transaccionesPrevias = queryClient.getQueryData(["transacciones"])
      queryClient.setQueryData(["transacciones"], (old: any) => {
        const itemOptimista = {
          ...nuevaTransaccion,
          id: `temp-${Date.now()}`,
          fecha: nuevaTransaccion.fecha.toISOString(),
        }
        return [itemOptimista, ...(old || [])]
      })
      return { transaccionesPrevias }
    },
    onError: (err, nuevaTransaccion, context) => {
      queryClient.setQueryData(["transacciones"], context?.transaccionesPrevias)
      toast.error("Error al guardar, intenta de nuevo")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transacciones"] })
      queryClient.invalidateQueries({ queryKey: ["resumen-mes"] })
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

    if (montoNumerico <= 0) {
      toast.error("Monto inválido", { description: "Ingresa un número mayor a 0." })
      return
    }

    const fechaFinal = new Date(fechaPreseleccionada)
    const ahora = new Date()
    fechaFinal.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds())

    const payload = {
      nombre: (formData.get("nombre") as string) || "Sin descripción",
      monto: montoNumerico,
      tipo: tipo,
      clasificacion: formData.get("clasificacion") as string, 
      metodo: (formData.get("metodo") as string) || "EFECTIVO",
      fecha: fechaFinal,
    }

    mutation.mutate(payload)
  }

  return (
    <DrawerContent className="px-6 pb-10 max-w-md mx-auto rounded-t-[3rem] bg-white border-none shadow-2xl">
      <DrawerHeader className="pt-8">
        <DrawerTitle className="text-2xl font-black text-center text-slate-900 tracking-tight">Nuevo Registro</DrawerTitle>
        <p className="text-center text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">
          {fechaPreseleccionada.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </DrawerHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de Flujo */}
        <div className="flex bg-slate-100 p-1.5 rounded-[1.8rem] gap-1.5">
          <button type="button" onClick={() => setTipo("INGRESO")}
            className={`flex-1 py-3.5 rounded-[1.4rem] font-bold text-xs transition-all flex items-center justify-center gap-2 ${tipo === 'INGRESO' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 opacity-60'}`}>
            <ArrowUpCircle size={18} /> INGRESO
          </button>
          <button type="button" onClick={() => setTipo("GASTO")}
            className={`flex-1 py-3.5 rounded-[1.4rem] font-bold text-xs transition-all flex items-center justify-center gap-2 ${tipo === 'GASTO' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 opacity-60'}`}>
            <ArrowDownCircle size={18} /> GASTO
          </button>
        </div>

        {/* Info Educativa: El impacto del flujo */}
        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3 items-start">
          <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
          <p className="text-[10px] leading-relaxed text-indigo-900 font-medium italic">
            {tipo === "INGRESO" 
              ? "Este ingreso aumenta tu flujo libre. Considera destinar un % a tus Activos." 
              : "Este gasto reduce tu flujo. Asegúrate de que aporte valor a tu calidad de vida."}
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
              className="h-24 text-5xl font-black border-none bg-slate-50 rounded-[2.5rem] pl-12 text-slate-900 focus:ring-2 ring-indigo-100" required 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Landmark className="absolute left-3 top-4 text-slate-400" size={14} />
              <select name="metodo" className="w-full h-12 rounded-xl bg-slate-50 border-none pl-8 pr-3 font-bold text-xs text-slate-600 outline-none appearance-none">
                <option value="EFECTIVO">💵 Efectivo</option>
                <option value="TARJETA">💳 Débito/Crédito</option>
              </select>
            </div>
            
            <select name="clasificacion" className="h-12 rounded-xl bg-slate-50 border-none px-3 font-black text-[10px] uppercase tracking-wider text-indigo-600 outline-none appearance-none border-2 border-indigo-50 shadow-sm" required>
              <option value="VIDA">🍎 Vida/Consumo</option>
              <option value="ACTIVO">📈 Inversión (Activo)</option>
              <option value="PASIVO">📉 Deuda (Pasivo)</option>
            </select>
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}
          className={`w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-[11px] text-white shadow-xl transition-all active:scale-95 ${tipo === 'INGRESO' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'}`}
        >
          {mutation.isPending ? "Sincronizando..." : "Confirmar Movimiento"}
        </Button>
      </form>
    </DrawerContent>
  )
}