"use client"

import { CheckCircle2, Circle, Zap, CalendarDays, Wallet, TrendingUp, Trash2 } from "lucide-react" // Agregamos Trash2
import { cn } from "@/lib/utils"
import { eliminarTransaccion } from "@/actions/transacciones" // Importamos la acción

export interface Movimiento {
  id: string;
  nombre: string;
  monto: number;
  categoria: string; 
  tipo: "INGRESO" | "GASTO";
  completado: boolean;
}

export function ListaFlujo({ movimientos = [] }: { movimientos?: Movimiento[] }) {
  
  // Función para manejar el borrado
  const handleEliminar = async (id: string) => {
    if (confirm("¿Estás seguro de borrar este registro?")) {
      await eliminarTransaccion(id);
      window.location.reload(); // Recarga para ver el cambio
    }
  };

  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-dashed text-center text-slate-400">
        No hay registros para este día.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {movimientos.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm group">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              item.categoria === "ACTIVO" ? "bg-emerald-100 text-emerald-600" : 
              item.categoria === "PASIVO" ? "bg-rose-100 text-rose-600" : 
              "bg-blue-100 text-blue-600"
            )}>
              {item.categoria === "ACTIVO" ? <TrendingUp className="h-4 w-4" /> : 
               item.categoria === "PASIVO" ? <Wallet className="h-4 w-4" /> : 
               <CalendarDays className="h-4 w-4" />}
            </div>
            
            <div>
              <p className="font-bold text-slate-800 text-sm">{item.nombre}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {item.categoria}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className={cn("font-black text-sm", item.tipo === "INGRESO" ? "text-emerald-600" : "text-slate-700")}>
              {item.tipo === "INGRESO" ? "+" : "-"}${item.monto.toLocaleString()}
            </p>
            
            {/* BOTÓN DE BORRAR: Aparece al final */}
            <button 
              onClick={() => handleEliminar(item.id)}
              className="text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}