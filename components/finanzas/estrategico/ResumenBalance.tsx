"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, Info, ShieldCheck } from "lucide-react"

interface ResumenBalanceProps {
  ingresosPasivos: number;
  gastosTotales: number;
  progreso: number;
  estado: string;
}

export function ResumenBalance({ ingresosPasivos, gastosTotales, progreso, estado }: ResumenBalanceProps) {
  // Explicación dinámica según el estado
  const getLabelEstado = (estado: string) => {
    if (estado.toLowerCase().includes("supervivencia")) return "Cubriendo lo básico";
    if (progreso >= 100) return "Independencia Total";
    return "Construyendo Libertad";
  }

  return (
    <Card className="border-none shadow-2xl rounded-[2.8rem] bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute right-5 top-5 p-8 opacity-5">
        <ShieldCheck size={180} />
      </div>
      
      <CardContent className="p-8 space-y-7 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nivel de Seguridad</p>
            <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-none font-bold px-4 py-1 rounded-full text-[10px]">
              {estado.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Libertad Real</p>
            <p className="text-4xl font-black text-emerald-400 tracking-tighter">{progreso}%</p>
          </div>
        </div>

        {/* BARRA DE PROGRESO PEDAGÓGICA */}
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
               Activos Generadores <Info size={12} className="text-slate-500" />
            </span>
            <span className="text-white">Meta: ${gastosTotales.toLocaleString('es-CL')}</span>
          </div>
          
          <div className="relative">
            <Progress value={progreso} className="h-4 bg-white/10 rounded-full" />
            {progreso > 0 && progreso < 100 && (
                <div className="absolute -bottom-6 left-0 text-[9px] text-slate-500 font-medium italic">
                    *Tus activos ya pagan el {progreso}% de tu vida.
                </div>
            )}
          </div>
        </div>

        {/* INDICADOR DE EXCEDENTE (CASH FLOW ESTRATÉGICO) */}
        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Potencial Mensual</p>
                <p className="text-2xl font-black text-white tracking-tight">
                    ${(ingresosPasivos - gastosTotales > 0 ? ingresosPasivos - gastosTotales : 0).toLocaleString('es-CL')}
                </p>
              </div>
          </div>
        </div>

        <p className="text-[9px] text-slate-500 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
            <strong>Concepto:</strong> La independencia financiera ocurre cuando tus <span className="text-slate-300">Activos</span> producen suficiente dinero para cubrir tus <span className="text-slate-300">Gastos</span> sin que tengas que trabajar.
        </p>
      </CardContent>
    </Card>
  )
}