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
  embedded?: boolean; 
  onSuccess?: () => void; 
}

export function FormularioEstrategico({ title, seccion, needsSubMonto, embedded, onSuccess }: FormularioEstrategicoProps) {
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
        
        if (embedded && onSuccess) {
          onSuccess();
        } else {
          setOpen(false);
        }
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

  // Diccionario Educativo Profesional
  const getLabels = () => {
    switch (seccion) {
      case "activos":
        return {
          header: "Nuevo Activo de Capital",
          montoLabel: "Valor de Mercado (¿Cuánto vale hoy?)",
          subMontoLabel: "Rendimiento (¿Cuánto dinero te genera al mes?)",
          helper: "El activo es un bien que pone dinero en tu bolsillo."
        };
      case "pasivos":
        return {
          header: "Nueva Deuda / Compromiso",
          montoLabel: "Saldo Total Pendiente (¿Cuánto debes?)",
          subMontoLabel: "Cuota Mensual (¿Cuánto pagas al mes?)",
          helper: "El pasivo es una obligación que quita dinero de tu bolsillo."
        };
      case "ingresos":
        return {
          header: "Nuevo Ingreso Fijo",
          montoLabel: "Monto del Ingreso",
          subMontoLabel: "",
          helper: "Flujo de entrada para operar y reinvertir."
        };
      case "gastos":
        return {
          header: "Nuevo Gasto Estratégico",
          montoLabel: "Costo del Gasto",
          subMontoLabel: "",
          helper: "Costo de mantener tu estilo de vida actual."
        };
      default:
        return {
          header: title,
          montoLabel: "Monto Base ($)",
          subMontoLabel: "Valor Actual",
          helper: ""
        };
    }
  };

  const labels = getLabels();

  const FormContent = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Concepto</label>
          <p className="text-[9px] font-bold text-indigo-400 italic">{labels.helper}</p>
        </div>
        <Input 
          placeholder="Ej: Inversión, Arriendo, Crédito..." 
          value={form.nombre} 
          onChange={(e) => setForm({...form, nombre: e.target.value})} 
          className="rounded-2xl bg-slate-50 border-none h-14 px-5 font-bold" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
          {labels.montoLabel}
        </label>
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
             <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
               {labels.subMontoLabel}
             </label>
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild><button type="button"><Info size={12} className="text-indigo-300" /></button></TooltipTrigger>
                 <TooltipContent className="bg-slate-900 text-white border-none rounded-xl p-3 text-[10px] max-w-[200px]">
                   {seccion === "activos" 
                    ? "Es el flujo de caja positivo que este bien inyecta a tus finanzas cada mes." 
                    : "Es el costo mensual que impacta tu presupuesto para mantener esta deuda."}
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
  );

  if (embedded) {
    return (
      <div className="py-2">
        {FormContent}
      </div>
    );
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
            {labels.header}
          </DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}