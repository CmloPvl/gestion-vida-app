"use client"

import { cn } from "@/lib/utils"
import { ShieldCheck, AlertCircle, Zap, Scale, TrendingUp } from "lucide-react"

interface IndicadorProps {
  ratioIndependencia: number;
  margenSeguridad: number;
  patrimonio: number;
  ahorro: number;
}

export function IndicadorContable({ ratioIndependencia, margenSeguridad, patrimonio, ahorro }: IndicadorProps) {
  
  // Lógica de diagnóstico contable
  const obtenerDiagnostico = () => {
    if (ratioIndependencia >= 100) return { label: "Libertad Financiera", color: "text-emerald-500", icon: <Zap size={14} /> }
    if (margenSeguridad > 30) return { label: "Estructura Saludable", color: "text-blue-500", icon: <ShieldCheck size={14} /> }
    if (ahorro < 0) return { label: "Déficit Operativo", color: "text-rose-500", icon: <AlertCircle size={14} /> }
    return { label: "Balance Estable", color: "text-slate-500", icon: <Scale size={14} /> }
  }

  const estado = obtenerDiagnostico();

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Métrica 1: Patrimonio Neto (Capital Real) */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patrimonio Neto</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-slate-900">${patrimonio.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 font-medium">CLP</span>
          </div>
        </div>

        {/* Métrica 2: Cobertura (Ratio Independencia) */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cobertura Pasiva</p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-slate-900">{ratioIndependencia.toFixed(1)}%</span>
            <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-emerald-500 transition-all duration-700" 
                style={{ width: `${Math.min(ratioIndependencia, 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Métrica 3: Margen de Seguridad (Ahorro vs Ingreso) */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Margen Seg.</p>
          <div className="flex items-center gap-2">
             <span className={cn("text-lg font-black", ahorro >= 0 ? "text-slate-900" : "text-rose-600")}>
              {margenSeguridad.toFixed(1)}%
            </span>
            <TrendingUp size={14} className={cn(ahorro >= 0 ? "text-emerald-500" : "text-rose-400 rotate-180")} />
          </div>
        </div>

        {/* Métrica 4: Diagnóstico de Auditoría */}
        <div className="space-y-1.5 border-l pl-6 border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado Auditoría</p>
          <div className={cn("flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight", estado.color)}>
            {estado.icon}
            {estado.label}
          </div>
        </div>

      </div>

      {/* Pie del indicador: Flujo Neto Mensual */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
        <span className="text-[9px] text-slate-400 italic font-medium">
          Análisis de solvencia en tiempo real basado en activos/pasivos declarados.
        </span>
        <div className="text-[10px] font-bold text-slate-500 flex gap-2">
          FLUJO NETO: 
          <span className={cn(ahorro >= 0 ? "text-emerald-600" : "text-rose-600")}>
            {ahorro >= 0 ? "+" : ""}${ahorro.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}