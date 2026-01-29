"use client"

import React, { useState } from "react"
import { crearTransaccion } from "@/actions/transacciones"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"
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
    const montoRaw = formData.get("monto")
    const montoNumerico = Number(montoRaw)

    if (montoNumerico <= 0) {
      toast.error("Monto inválido", { description: "Ingresa un número mayor a 0." })
      return
    }

    const fechaFinal = new Date(fechaPreseleccionada)
    const ahora = new Date()
    fechaFinal.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds())

    // --- EL ARREGLO ESTÁ AQUÍ ---
    const payload = {
      nombre: (formData.get("nombre") as string) || "Sin descripción",
      monto: montoNumerico,
      tipo: tipo, // "INGRESO" o "GASTO"
      // CAMBIAMOS 'categoria' por 'clasificacion' para que Zod lo reconozca
      clasificacion: formData.get("clasificacion") as string, 
      metodo: (formData.get("metodo") as string) || "EFECTIVO",
      fecha: fechaFinal,
    }

    mutation.mutate(payload)
  }

  return (
    <DrawerContent className="px-6 pb-10 max-w-md mx-auto rounded-t-[2.5rem] bg-white border-none shadow-2xl">
      <DrawerHeader className="pt-6">
        <DrawerTitle className="text-xl font-black text-center text-slate-800">Nuevo Movimiento</DrawerTitle>
      </DrawerHeader>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
          <button type="button" onClick={() => setTipo("INGRESO")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tipo === 'INGRESO' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>
            <ArrowUpCircle className="inline mr-1" size={16} /> Ingreso
          </button>
          <button type="button" onClick={() => setTipo("GASTO")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tipo === 'GASTO' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>
            <ArrowDownCircle className="inline mr-1" size={16} /> Gasto
          </button>
        </div>

        <div className="space-y-4">
          <Input name="nombre" placeholder="¿En qué? (ej: Venta local)" className="h-12 border-none bg-slate-50 rounded-xl px-4 font-bold" required />
          
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
            <Input name="monto" type="number" inputMode="decimal" min="0.01" step="any" placeholder="0" 
              className="h-16 text-3xl font-black border-none bg-slate-50 rounded-2xl pl-8" required 
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select name="metodo" className="h-12 rounded-xl bg-slate-50 border-none px-3 font-bold text-slate-600 outline-none">
              <option value="EFECTIVO">💵 Efectivo</option>
              <option value="TARJETA">💳 Tarjeta</option>
            </select>
            {/* El name debe ser 'clasificacion' para coincidir con el payload */}
            <select name="clasificacion" className="h-12 rounded-xl bg-slate-50 border-none px-3 font-bold text-slate-600 outline-none" required>
              <option value="VIDA">Vida</option>
              <option value="ACTIVO">Inversión</option>
              <option value="PASIVO">Deuda</option>
            </select>
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}
          className={`w-full h-14 rounded-2xl font-bold text-white transition-transform active:scale-95 ${tipo === 'INGRESO' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'}`}
        >
          {mutation.isPending ? "Cargando..." : "Confirmar Movimiento"}
        </Button>
      </form>
    </DrawerContent>
  )
}