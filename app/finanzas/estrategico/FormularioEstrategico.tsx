"use client"

import React, { useState, useTransition } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation" 
import { createEstrategicoItem } from "@/actions/estrategico"

export function FormularioEstrategico({ title, needsSubMonto }: { title: string, needsSubMonto?: boolean }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ nombre: "", monto: "", subMonto: "" })
  const router = useRouter()

  const obtenerSeccion = (t: string): "ingresos" | "gastos" | "activos" | "pasivos" => {
    const text = t.toLowerCase();
    if (text.includes("activo") && !text.includes("patrimonio")) return "ingresos";
    if (text.includes("costo") || text.includes("gasto")) return "gastos";
    if (text.includes("patrimonio") || text.includes("activo")) return "activos";
    return "pasivos";
  }

  const handleSubmit = async () => {
    const m = Number(form.monto)
    const s = Number(form.subMonto)

    if (!form.nombre || m <= 0) {
      toast.error("Datos inválidos", { description: "El nombre y monto son obligatorios." })
      return
    }

    startTransition(async () => {
      const seccion = obtenerSeccion(title)
      
      const result = await createEstrategicoItem({
        nombre: form.nombre,
        monto: Math.abs(m),
        subMonto: needsSubMonto ? s : 0,
        seccion: seccion
      })

      if (result.success) {
        toast.success("¡Guardado!", { description: `${form.nombre} registrado.` })
        setForm({ nombre: "", monto: "", subMonto: "" })
        setOpen(false)
        router.refresh() // Actualiza la lista automáticamente
      } else {
        toast.error("Error", { description: result.error })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-2xl bg-white shadow-sm border border-slate-100 h-11 w-11 active:scale-90"
        >
          <Plus size={22} className="text-slate-900" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] w-[94%] max-w-sm border-none shadow-2xl p-8 bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
            Registrar en {title}
          </DialogTitle>
          <DialogDescription className="text-center text-[10px] text-slate-300 uppercase">
            Añade un nuevo registro estratégico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input 
            placeholder="Concepto (ej: Depto, Sueldo)" 
            value={form.nombre} 
            disabled={isPending}
            onChange={(e) => setForm({...form, nombre: e.target.value})} 
            className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold" 
          />
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Valor Total</label>
            <Input 
              type="number" 
              placeholder="0" 
              disabled={isPending}
              value={form.monto} 
              onChange={(e) => setForm({...form, monto: e.target.value})} 
              className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold text-lg" 
            />
          </div>
          {needsSubMonto && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Flujo Mensual</label>
              <Input 
                type="number" 
                placeholder="0" 
                disabled={isPending}
                value={form.subMonto} 
                onChange={(e) => setForm({...form, subMonto: e.target.value})} 
                className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold text-lg text-indigo-600" 
              />
            </div>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={isPending}
            className="w-full h-16 rounded-[2rem] bg-slate-900 font-black text-white shadow-xl mt-4 uppercase tracking-widest text-[11px] active:scale-95 transition-all"
          >
            {isPending ? <Loader2 className="animate-spin" size={18} /> : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}