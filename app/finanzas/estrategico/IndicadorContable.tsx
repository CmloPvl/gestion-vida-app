"use client"

import React from "react"
import { ShieldCheck, AlertCircle, Zap, Scale, Coins, PiggyBank } from "lucide-react"
import { cn } from "@/lib/utils"

export function IndicadorContable({ patrimonio, margen, ahorro, ratio }: any) {
  const obtenerDiagnostico = () => {
    if (ratio >= 100) return { label: "Independencia", color: "text-emerald-500", icon: <Zap size={14} /> }
    if (margen > 30) return { label: "Estructura Saludable", color: "text-indigo-500", icon: <ShieldCheck size={14} /> }
    if (ahorro < 0) return { label: "Déficit Operativo", color: "text-rose-500", icon: <AlertCircle size={14} /> }
    return { label: "Balance Estable", color: "text-slate-500", icon: <Scale size={14} /> }
  }
  
  const estado = obtenerDiagnostico();

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Coins size={12} />
            <p className="text-[9px] font-black uppercase tracking-widest">Patrimonio Neto</p>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">
            ${patrimonio.toLocaleString('es-CL')}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <PiggyBank size={12} />
            <p className="text-[9px] font-black uppercase tracking-widest">Margen Seg.</p>
          </div>
          <p className={cn("text-2xl font-black tracking-tighter", ahorro >= 0 ? "text-slate-900" : "text-rose-600")}>
            {margen.toFixed(1)}%
          </p>
        </div>

        <div className="col-span-2 pt-6 border-t border-slate-50 flex justify-between items-center">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1.5 tracking-tighter">Estado de Salud</p>
            <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase italic", estado.color)}>
              {estado.icon} {estado.label}
            </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-slate-400 uppercase mb-1.5 tracking-tighter">Flujo Neto Mensual</p>
             <p className={cn("text-sm font-black tracking-tighter", ahorro >= 0 ? "text-emerald-500" : "text-rose-500")}>
               {ahorro >= 0 ? '+' : ''}${ahorro.toLocaleString('es-CL')}
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}