"use client"

import React, { useState } from "react"
import { Plus, Loader2, Info } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FormularioEstrategicoProps {
  title: string;
  seccion: "ingresos" | "gastos" | "activos" | "pasivos";
  needsSubMonto?: boolean;
}

export function FormularioEstrategico({ title, seccion, needsSubMonto }: FormularioEstrategicoProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", monto: "", subMonto: "" })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createEstrategicoItem,
    onSuccess: (result: any) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["estrategico"] })
        toast.success("¡Estrategia actualizada!")
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
    if (isNaN(montoNum) || montoNum <= 0) return toast.error("Ingresa un monto válido")

    mutation.mutate({
      nombre: form.nombre.trim(),
      monto: montoNum,
      subMonto: subMontoNum,
      seccion: seccion 
    })
  }

  const getHelperText = () => {
    switch (seccion) {
      case "activos": return "Los activos compran tu libertad futura."
      case "pasivos": return "Las deudas restan velocidad a tu crecimiento."
      case "ingresos": return "Flujo de entrada para operar y reinvertir."
      case "gastos": return "Costo de mantener tu estilo de vida actual."
      default: return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="rounded-2xl shadow-lg h-11 w-11 flex items-center justify-center bg-slate-900 hover:bg-black text-white active:scale-90 transition-all border-none"
        >
          <Plus size={20} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[3rem] w-[94%] max-w-sm p-8 bg-white border-none shadow-2xl overflow-hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 text-center">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Concepto</label>
              <p className="text-[9px] font-bold text-indigo-400 italic">{getHelperText()}</p>
            </div>
            <Input 
              placeholder="Ej: Inversión, Arriendo..." 
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
              <div className="flex items-center gap-2 px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Valor Actual</label>
                 <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild><button type="button"><Info size={12} className="text-indigo-300" /></button></TooltipTrigger>
                     <TooltipContent className="bg-slate-900 text-white border-none rounded-xl p-3 text-[10px]">
                        Define cuánto vale hoy este activo o pasivo.
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
              </div>
              <Input 
                type="number" 
                placeholder="0" 
                value={form.subMonto} 
                onChange={(e) => setForm({...form, subMonto: e.target.value})} 
                className="rounded-2xl bg-indigo-50/50 border-none h-14 px-5 font-bold text-lg text-indigo-600" 
              />
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={mutation.isPending}
            className="w-full h-16 rounded-[2.2rem] bg-slate-900 font-black text-white shadow-xl mt-4 uppercase tracking-[0.2em] text-[11px] active:scale-95 transition-all border-none"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Actualizar Estrategia"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}