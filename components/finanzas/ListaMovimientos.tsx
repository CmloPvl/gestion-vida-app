"use client"

import React from "react"
import { TrendingUp, Wallet, CalendarDays, Trash2, CreditCard, Banknote, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// 1. Quitamos la importación directa de la action y usamos el Hook
export interface Movimiento {
  id: string;
  nombre: string;
  monto: number;
  clasificacion: string;
  tipo: string;
  metodo: string;
  completado: boolean;
}

interface ListaProps {
  movimientos: Movimiento[];
  fecha: Date;
  // Agregamos estas props para conectar con useFinanzas
  onEliminar: (id: string) => void;
  isDeleting?: boolean;
}

export function ListaMovimientos({ movimientos, fecha, onEliminar }: ListaProps) {
  
  // Ahora handleEliminar ya no dispara el alert de 'confirm'
  const handleEliminar = (id: string) => {
    onEliminar(id); 
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
          Movimientos
        </h2>
        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase italic">
          {fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-3 min-h-30">
        {movimientos.length > 0 ? (
          <div className="space-y-2">
            {movimientos.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 bg-[#FBFBFC] hover:bg-white hover:shadow-md hover:scale-[1.01] transition-all duration-200 rounded-[1.8rem] group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl shadow-sm transition-colors",
                    item.clasificacion === "ACTIVO" ? "bg-emerald-50 text-emerald-600" : 
                    item.clasificacion === "PASIVO" ? "bg-rose-50 text-rose-600" : 
                    "bg-indigo-50 text-indigo-600"
                  )}>
                    {item.clasificacion === "ACTIVO" ? <TrendingUp size={16} /> : 
                     item.clasificacion === "PASIVO" ? <Wallet size={16} /> : 
                     <CalendarDays size={16} />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 text-sm leading-tight">{item.nombre}</p>
                        {item.metodo === "TARJETA" ? 
                            <CreditCard size={10} className="text-slate-400" /> : 
                            <Banknote size={10} className="text-slate-400" />
                        }
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">
                      {item.clasificacion} • {item.metodo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className={cn(
                    "font-black text-sm tracking-tighter", 
                    item.tipo === "INGRESO" ? "text-emerald-500" : "text-slate-900"
                  )}>
                    {item.tipo === "INGRESO" ? "+" : "-"}${item.monto.toLocaleString('es-CL')}
                  </p>
                  
                  <button 
                    onClick={() => handleEliminar(item.id)}
                    className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100"
                    title="Eliminar registro"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="bg-slate-50 p-4 rounded-full">
               <CalendarDays className="text-slate-200" size={32} />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Sin registros para este día
            </p>
          </div>
        )}
      </div>
    </section>
  )
}