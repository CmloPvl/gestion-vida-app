"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Info, Lightbulb, ShieldCheck, Zap, Scale, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface IndicadorContableProps {
  patrimonio: number;
  margen: number;
  ahorro: number;
  ratio: number;
}

export function IndicadorContable({ patrimonio, margen, ahorro, ratio }: IndicadorContableProps) {
  
  const obtenerDiagnostico = () => {
    // Orden de prioridad: Riesgo -> Libertad -> Salud -> Balance
    if (ahorro < 0) return { label: "Déficit Operativo", color: "text-rose-500", icon: <AlertCircle size={14} />, desc: "Alerta: Gastas más de lo que generas." }
    if (ratio >= 100) return { label: "Independencia Total", color: "text-emerald-500", icon: <Zap size={14} />, desc: "Tus activos ya cubren tu vida." }
    if (margen > 30) return { label: "Estructura Saludable", color: "text-indigo-500", icon: <ShieldCheck size={14} />, desc: "Gran capacidad de ahorro y reinversión." }
    return { label: "Balance Estable", color: "text-slate-500", icon: <Scale size={14} />, desc: "Flujo equilibrado, foco en aumentar activos." }
  }
  
  const estado = obtenerDiagnostico();

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden border border-slate-100">
        <CardContent className="p-8 space-y-8">
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600">
                <Lightbulb size={14} className="fill-indigo-100" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Riqueza Real</p>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Patrimonio Neto</h2>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                  <Info className="h-5 w-5 text-slate-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 bg-slate-900 text-white p-4 rounded-2xl border-none shadow-2xl">
                <p className="text-xs leading-relaxed">
                  <span className="font-black text-emerald-400">Educación Financiera:</span> El Patrimonio es lo que realmente te pertenece (Activos - Deudas).
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="py-2">
            <p className={`text-5xl font-black tracking-tighter transition-all ${patrimonio >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              ${patrimonio.toLocaleString('es-CL')}
            </p>
            <div className="flex items-center gap-3 mt-4">
               <div className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-50", estado.color)}>
                  {estado.icon} {estado.label}
               </div>
               <p className="text-[9px] text-slate-400 font-medium italic">{estado.desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Margen de Ahorro</p>
              <p className={cn("text-xl font-black tracking-tighter", margen > 10 ? "text-slate-900" : "text-rose-600")}>
                {margen.toFixed(1)}%
              </p>
              <p className="text-[8px] text-slate-400">Eficiencia mensual.</p>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Flujo Neto</p>
              <p className={cn("text-xl font-black tracking-tighter", ahorro >= 0 ? "text-emerald-500" : "text-rose-500")}>
                {ahorro >= 0 ? '+' : ''}${ahorro.toLocaleString('es-CL')}
              </p>
              <p className="text-[8px] text-slate-400">Dinero libre.</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </TooltipProvider>
  )
}