"use client"

import React, { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Plus as PlusIcon, Loader2 as LoaderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createEstrategicoItem } from "@/actions/estrategico"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function FormularioEstrategico({ 
  title, 
  needsSubMonto 
}: { 
  title: string, 
  needsSubMonto: boolean 
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", monto: "", subMonto: "" })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createEstrategicoItem,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["estrategico"] })
        toast.success("¡Agregado con éxito!")
        setForm({ nombre: "", monto: "", subMonto: "" })
        setOpen(false)
      } else {
        toast.error(result.error || "Error al guardar")
      }
    }
  })

  const handleSubmit = async () => {
    const montoNum = Number(form.monto)
    const subMontoNum = form.subMonto ? Number(form.subMonto) : montoNum

    if (!form.nombre.trim()) return toast.error("Escribe un nombre")
    if (isNaN(montoNum) || montoNum <= 0) return toast.error("Monto base inválido")

    // Mapeo preciso para el Schema
    let seccionFinal: "ingresos" | "gastos" | "activos" | "pasivos" = "ingresos";
    const t = title.toLowerCase();

    if (t.includes("flujo activo") || t.includes("ingreso")) seccionFinal = "ingresos";
    else if (t.includes("costo de vida") || t.includes("gasto")) seccionFinal = "gastos";
    else if (t.includes("patrimonio") || t.includes("activo")) seccionFinal = "activos";
    else if (t.includes("obligaciones") || t.includes("pasivo")) seccionFinal = "pasivos";

    mutation.mutate({
      nombre: form.nombre.trim(),
      monto: montoNum,
      subMonto: subMontoNum,
      seccion: seccionFinal 
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="rounded-2xl shadow-sm h-11 w-11 p-0 bg-slate-900 hover:bg-slate-800 text-white active:scale-90 transition-all border-none"
        >
          <PlusIcon size={18} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2.5rem] w-[94%] max-w-sm p-8 bg-white border-none shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
            Añadir a {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nombre</label>
            <Input 
              placeholder="Ej: Ahorros, Crédito..." 
              value={form.nombre} 
              onChange={(e) => setForm({...form, nombre: e.target.value})} 
              className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Monto Base ($)</label>
            <Input 
              type="number" 
              placeholder="0" 
              value={form.monto} 
              onChange={(e) => setForm({...form, monto: e.target.value})} 
              className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold text-lg" 
            />
          </div>

          {needsSubMonto && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 px-1">Valor Actual ($)</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={form.subMonto} 
                onChange={(e) => setForm({...form, subMonto: e.target.value})} 
                className="rounded-2xl bg-indigo-50/50 border-none h-14 px-5 font-bold text-lg text-indigo-600 focus:ring-1 ring-indigo-200" 
              />
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={mutation.isPending}
            className="w-full h-16 rounded-[2rem] bg-slate-900 font-black text-white shadow-xl mt-4 uppercase tracking-widest text-[11px] active:scale-95 transition-all border-none"
          >
            {mutation.isPending ? <LoaderIcon className="animate-spin" size={18} /> : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}