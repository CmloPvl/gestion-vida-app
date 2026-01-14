"use client"

import { Plus, Trash2, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FinItem } from "@/hooks/use-estrategico"
import { cn } from "@/lib/utils"

interface SeccionProps {
  titulo: string;
  explicacion: string;
  items: FinItem[];
  color: "emerald" | "rose" | "blue" | "slate";
  onAgregar: () => void;
  onQuitar: (id: string) => void;
  tipoMonto?: string; // "monto" o "subMonto" (cash flow)
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
    emerald: "border-emerald-100 bg-emerald-50/30 text-emerald-700",
    rose: "border-rose-100 bg-rose-50/30 text-rose-700",
    blue: "border-blue-100 bg-blue-50/30 text-blue-700",
    slate: "border-slate-100 bg-slate-50/30 text-slate-700",
  }

  const total = items.reduce((acc, curr) => {
    const valor = tipoMonto === "subMonto" ? (curr.subMonto || 0) : curr.monto
    return acc + valor
  }, 0)

  return (
    <Card className={cn("border-none shadow-sm rounded-3xl", colorMap[color])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">{titulo}</CardTitle>
            <Badge variant="outline" className="text-[9px] font-bold">
              ${total.toLocaleString()}
            </Badge>
          </div>
          <p className="text-[10px] opacity-70 italic flex items-center gap-1">
            <Info className="h-3 w-3" /> ({explicacion})
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onAgregar}
          className="rounded-full hover:bg-white/50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="text-[10px] text-center py-4 opacity-40 uppercase font-bold">Sin registros</p>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-3 rounded-2xl group border border-white/50 shadow-sm"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">{item.nombre}</p>
                {tipoMonto === "subMonto" && item.monto > 0 && (
                  <p className="text-[9px] text-slate-400 font-medium">Valor total: ${item.monto.toLocaleString()}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black">
                  ${(tipoMonto === "subMonto" ? (item.subMonto || 0) : item.monto).toLocaleString()}
                </span>
                <button 
                  onClick={() => onQuitar(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}