"use client"

import React, { useTransition } from "react"
import { Trash2, Info, Loader2, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { FormularioEstrategico } from "./FormularioEstrategico"
import { deleteEstrategicoItem } from "@/actions/estrategico"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function BotonAyuda({ titulo, explicacion }: { titulo: string, explicacion: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-slate-300 hover:text-indigo-500 transition-colors p-1">
          <Info size={14} />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] w-[90%] max-w-sm border-none shadow-2xl p-8 bg-white">
        <DialogHeader className="space-y-4">
          <div className="mx-auto bg-slate-100 p-4 rounded-3xl w-fit text-slate-900">
            <Info size={28} />
          </div>
          <DialogTitle className="text-center font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
            Entendiendo: {titulo}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 text-sm leading-relaxed pt-2">
            {explicacion}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export function SectionContainer({ 
  title, 
  detail, 
  icon, 
  color, 
  items, 
  isAsset, 
  isLiability, 
  ayuda, 
  seccion,
  montoExtra = 0 
}: any) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const colorMap: any = { 
    emerald: "text-emerald-600 bg-emerald-50", 
    rose: "text-rose-600 bg-rose-50", 
    blue: "text-indigo-600 bg-indigo-50", 
    slate: "text-slate-600 bg-slate-50" 
  }

  const textColor = colorMap[color]?.split(' ')[0] || "text-slate-600";

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteEstrategicoItem(id);
      if (result.success) {
        toast.success("Eliminado correctamente");
        router.refresh();
      } else {
        toast.error("Error al eliminar");
      }
    });
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-2xl shadow-sm", colorMap[color])}>{icon}</div>
          <div>
            <div className="flex items-center gap-2 leading-none">
              <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-wider">{title}</h3>
              <BotonAyuda titulo={title} explicacion={ayuda} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">{detail}</p>
          </div>
        </div>
        <FormularioEstrategico title={title} seccion={seccion} needsSubMonto={isAsset || isLiability} />
      </header>

      <div className="space-y-3">
        {montoExtra > 0 && (
          <Card className="border-none shadow-sm rounded-[1.8rem] bg-slate-50/50 border border-dashed border-slate-200 overflow-hidden italic">
            <CardContent className="p-5 flex justify-between items-center opacity-70">
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 rounded-full bg-slate-300" />
                <div className="flex flex-col">
                  <p className="font-bold text-slate-500 text-xs uppercase tracking-tight flex items-center gap-1">
                    <Activity size={10} /> Movimientos Diarios
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium">Sincronizado desde el Pad</p>
                </div>
              </div>
              <div className="text-right px-4">
                <p className="font-black text-sm text-slate-500">
                  ${montoExtra.toLocaleString('es-CL')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {(!items || items.length === 0) && montoExtra === 0 && (
          <div className="bg-white/40 border-2 border-dashed border-slate-100 rounded-[1.8rem] py-8 flex flex-col items-center">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Sin registros aún</p>
          </div>
        )}

        {items?.map((item: any) => (
          <Card key={item.id} className="border-none shadow-sm rounded-[1.8rem] bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={cn("w-1 h-10 rounded-full", color === "blue" ? "bg-indigo-500" : `bg-${color}-500`)} />
                <div>
                  <p className="font-bold text-slate-800 text-sm">{item.nombre}</p>
                  {(isAsset || isLiability) && (
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-0.5">
                      {isAsset ? "Patrimonio: " : "Deuda Total: "} 
                      ${item.monto.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  {(isAsset || isLiability) && (
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
                      {isAsset ? "Ingreso" : "Cuota"}
                    </p>
                  )}
                  <p className={cn("font-black text-sm tracking-tighter", textColor)}>
                    ${ (isAsset || isLiability ? item.subMonto : item.monto)?.toLocaleString('es-CL') }
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  disabled={isPending}
                  className="p-2 text-slate-100 group-hover:text-rose-400 transition-colors"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}