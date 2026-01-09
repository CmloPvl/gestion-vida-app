"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap } from "lucide-react"

interface ResumenBalanceProps {
  ingresosPasivos: number;
  gastosTotales: number;
  progreso: number;
  estado: string;
}

export function ResumenBalance({ ingresosPasivos, gastosTotales, progreso, estado }: ResumenBalanceProps) {
  return (
    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute right-0 top-0 p-8 opacity-10">
        <Zap size={100} />
      </div>
      
      <CardContent className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado Actual</p>
            <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4">
              {estado}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Independencia</p>
            <p className="text-3xl font-black text-emerald-400">{progreso}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Ingresos Pasivos (Activos)</span>
            <span>Meta: ${gastosTotales.toLocaleString()}</span>
          </div>
          <Progress value={progreso} className="h-3 bg-white/10" />
          <p className="text-[10px] text-slate-500 italic">
            * Tu objetivo es que tus activos paguen tu estilo de vida.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Flujo Mensual Libre</p>
            <p className="text-xl font-bold">${(ingresosPasivos - gastosTotales > 0 ? ingresosPasivos - gastosTotales : 0).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}