"use client"

import React, { useState } from "react"
import { Plus, Loader2, Tag, DollarSign, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { crearTransaccion } from "@/actions/transacciones"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const CAT_FINANZAS = [
  { label: "🏠 Hogar", value: "HOGAR" },
  { label: "🍎 Alimentación", value: "ALIMENTACION" },
  { label: "🚗 Transporte", value: "TRANSPORTE" },
  { label: "⚕️ Salud", value: "SALUD" },
  { label: "✨ Estilo de Vida", value: "VIDA" },
  { label: "⚙️ Otros", value: "OTROS" }
]

interface Props {
  tipoDefault: "INGRESO" | "GASTO"
}

export function FormularioTransaccion({ tipoDefault }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", monto: "", clasificacion: "" })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: crearTransaccion,
    onSuccess: (result: any) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["transacciones"] })
        toast.success("Movimiento registrado correctamente")
        setForm({ nombre: "", monto: "", clasificacion: "" })
        setOpen(false)
      } else {
        toast.error(result.error || "Error al procesar")
      }
    }
  })

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return toast.error("La descripción es necesaria");
    const montoNum = Number(form.monto);
    if (isNaN(montoNum) || montoNum <= 0) return toast.error("Ingresa un monto válido");
    if (!form.clasificacion) return toast.error("Selecciona una categoría");

    mutation.mutate({
      nombre: form.nombre.trim(),
      monto: montoNum,
      tipo: tipoDefault,
      clasificacion: form.clasificacion,
      metodo: "EFECTIVO"
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className={`rounded-2xl h-12 px-6 active:scale-95 transition-all font-bold border-none shadow-lg ${
            tipoDefault === "INGRESO" 
            ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" 
            : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
          } text-white`}
        >
          <Plus size={18} className="mr-2" />
          {tipoDefault === "INGRESO" ? "Nuevo Ingreso" : "Nuevo Gasto"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2.5rem] w-[95%] max-w-sm p-8 bg-white border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mb-6">
            Flujo de Caja: {tipoDefault}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Concepto</label>
            <div className="relative">
              <Tag className="absolute left-4 top-4 text-slate-300" size={18} />
              <Input 
                placeholder="Ej: Compra mensual, Bonus..." 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} 
                className="rounded-2xl bg-slate-50 border-none h-14 pl-12 font-bold focus:ring-2 ring-slate-100" 
              />
            </div>
          </div>

          {/* Monto */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Cantidad (CLP)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-4 text-slate-300" size={18} />
              <Input 
                type="number" 
                placeholder="0" 
                value={form.monto} 
                onChange={(e) => setForm({...form, monto: e.target.value})} 
                className="rounded-2xl bg-slate-50 border-none h-14 pl-12 font-bold text-lg focus:ring-2 ring-slate-100" 
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">Clasificación</label>
            <div className="relative">
                <Wallet className="absolute left-4 top-4 text-slate-300" size={18} />
                <select 
                  value={form.clasificacion}
                  onChange={(e) => setForm({...form, clasificacion: e.target.value})}
                  className="w-full rounded-2xl bg-slate-50 border-none h-14 pl-12 pr-5 font-bold text-slate-900 appearance-none focus:ring-2 ring-slate-100"
                >
                  <option value="" disabled>Seleccionar...</option>
                  {CAT_FINANZAS.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={mutation.isPending}
            className={`w-full h-16 rounded-[2rem] font-black text-white shadow-xl mt-4 uppercase tracking-widest text-[11px] active:scale-95 transition-all border-none ${
                tipoDefault === 'INGRESO' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'
            }`}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : `Confirmar ${tipoDefault}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}