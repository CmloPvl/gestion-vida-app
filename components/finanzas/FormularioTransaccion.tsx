"use client"

import React, { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { crearTransaccion } from "@/actions/transacciones"
import { createEstrategicoItem } from "@/actions/estrategico" // Importamos la otra acción
import { useMutation, useQueryClient } from "@tanstack/react-query"

// 1. Categorías dinámicas según el uso
const CAT_FINANZAS = [
  { label: "Alimentación", value: "ALIMENTACION" },
  { label: "Transporte", value: "TRANSPORTE" },
  { label: "Hogar", value: "HOGAR" },
  { label: "Salud", value: "SALUD" },
  { label: "Otros", value: "OTROS" }
]

const CAT_ESTRATEGICO = [
  { label: "Activo Fijo", value: "ACTIVO" },
  { label: "Pasivo/Deuda", value: "PASIVO" },
  { label: "Inversión", value: "INVERSION" },
  { label: "Patrimonio", value: "VIDA" }
]

export function FormularioTransaccion({ 
  tipoDefault, 
  isEstrategico = false // Nueva prop para saber dónde estamos
}: { 
  tipoDefault: "INGRESO" | "GASTO" | "ACTIVO" | "PASIVO",
  isEstrategico?: boolean 
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", monto: "", subMonto: "", clasificacion: "" })
  const queryClient = useQueryClient()

  // 2. Mutación Inteligente
  const mutation = useMutation({
    mutationFn: isEstrategico ? createEstrategicoItem : crearTransaccion,
    onSuccess: (result: any) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: isEstrategico ? ["estrategico"] : ["transacciones"] })
        toast.success("¡Registrado con éxito!")
        setForm({ nombre: "", monto: "", subMonto: "", clasificacion: "" })
        setOpen(false)
      } else {
        toast.error("Error", { description: result.error })
      }
    }
  })

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return toast.error("Escribe una descripción");
    const montoNum = Number(form.monto);
    if (isNaN(montoNum) || montoNum <= 0) return toast.error("Monto inválido");

    if (isEstrategico) {
      // Lógica para Plan Estratégico
      mutation.mutate({
        nombre: form.nombre.trim(),
        monto: montoNum, // En estratégico, el monto suele ser el valor base
        subMonto: Number(form.subMonto) || montoNum,
        tipo: tipoDefault 
      } as any)
    } else {
      // Lógica para Finanzas Diarias
      if (!form.clasificacion) return toast.error("Selecciona una categoría");
      mutation.mutate({
        nombre: form.nombre.trim(),
        monto: montoNum,
        tipo: tipoDefault,
        clasificacion: form.clasificacion,
        metodo: "EFECTIVO",
        fecha: new Date()
      } as any)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className={`rounded-2xl shadow-sm h-11 px-4 active:scale-90 transition-all ${
            tipoDefault === "INGRESO" || tipoDefault === "ACTIVO" ? "bg-emerald-500" : "bg-rose-500"
          } text-white font-bold border-none`}
        >
          <Plus size={18} className={isEstrategico ? "" : "mr-2"} />
          {!isEstrategico && (tipoDefault === "INGRESO" ? "Nuevo Ingreso" : "Nuevo Gasto")}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2.5rem] w-[94%] max-w-sm p-8 bg-white border-none shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
            {isEstrategico ? `Añadir a ${tipoDefault}` : `Nuevo ${tipoDefault}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input 
            placeholder="Nombre / Descripción" 
            value={form.nombre} 
            onChange={(e) => setForm({...form, nombre: e.target.value})} 
            className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold" 
          />
          <Input 
            type="number" 
            placeholder={isEstrategico ? "Monto Base ($)" : "Monto ($)"}
            value={form.monto} 
            onChange={(e) => setForm({...form, monto: e.target.value})} 
            className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold text-lg" 
          />

          {isEstrategico ? (
            <Input 
              type="number" 
              placeholder="Valor Actual ($)" 
              value={form.subMonto} 
              onChange={(e) => setForm({...form, subMonto: e.target.value})} 
              className="rounded-2xl bg-indigo-50/50 border-none h-14 px-5 font-bold text-indigo-600" 
            />
          ) : (
            <select 
              value={form.clasificacion}
              onChange={(e) => setForm({...form, clasificacion: e.target.value})}
              className="w-full rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold text-slate-900"
            >
              <option value="" disabled>Categoría</option>
              {CAT_FINANZAS.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={mutation.isPending}
            className="w-full h-16 rounded-[2rem] bg-slate-900 font-black text-white shadow-xl mt-4 uppercase tracking-widest text-[11px]"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}