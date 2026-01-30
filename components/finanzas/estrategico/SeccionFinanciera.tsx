"use client"

import { Plus, Trash2, Info, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SeccionProps {
  titulo: string;
  explicacion: string;
  items: any[];
  color: "emerald" | "rose" | "blue" | "slate";
  onAgregar: () => void;
  onQuitar: (id: string) => void;
  tipoMonto?: string;
}

export function SeccionFinanciera({ 
  titulo, 
  explicacion, 
  items, 
  color, 
  onAgregar, 
  onQuitar,
  tipoMonto = "monto" 
}: SeccionProps) {
  
  const colorMap = {
    emerald: "border-emerald-100 bg-emerald-50/20 text-emerald-800", // Activos
    rose: "border-rose-100 bg-rose-50/20 text-rose-800",       // Pasivos
    blue: "border-blue-100 bg-blue-50/20 text-blue-800",       // Ingresos
    slate: "border-slate-200 bg-slate-50/50 text-slate-800",    // Gastos
  }

  const total = items.reduce((acc, curr) => {
    const valor = tipoMonto === "subMonto" ? (curr.subMonto || 0) : curr.monto
    return acc + valor
  }, 0)

  return (
    <Card className={cn("border-2 shadow-none rounded-[2rem] overflow-hidden transition-all", colorMap[color])}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.15em]">{titulo}</CardTitle>
            <Badge className={cn("rounded-lg border-none px-2 py-0.5 text-[10px] font-black", 
                color === 'rose' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'
            )}>
              ${total.toLocaleString('es-CL')}
            </Badge>
          </div>
          <div className="flex items-start gap-1.5 max-w-5">
            <HelpCircle className="h-3 w-3 mt-0.5 shrink-0 opacity-50" />
            <p className="text-[10px] leading-tight font-medium opacity-70 italic">
               {explicacion}
            </p>
          </div>
        </div>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={onAgregar}
          className="rounded-2xl h-10 w-10 shadow-sm bg-white hover:bg-white/80 shrink-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-6">
        {items.length === 0 ? (
          <div className="py-8 px-4 border-2 border-dashed border-black/5 rounded-[1.5rem] flex flex-col items-center gap-2">
             <p className="text-[9px] text-center opacity-40 uppercase font-black tracking-widest">Sin registros activos</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-[1.2rem] group border border-white shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-800">{item.nombre}</p>
                {tipoMonto === "subMonto" && item.monto > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                        Base: ${item.monto.toLocaleString('es-CL')}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black tracking-tight bg-slate-100 px-2 py-1 rounded-lg">
                  ${(tipoMonto === "subMonto" ? (item.subMonto || 0) : item.monto).toLocaleString('es-CL')}
                </span>
                <button 
                  onClick={() => onQuitar(item.id)}
                  className="p-2 hover:bg-rose-100 rounded-xl text-slate-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}