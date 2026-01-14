"use client"

import { useState } from "react"
import { crearTransaccion } from "@/actions/transacciones"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"

interface AddTransactionFormProps {
  onSuccess?: () => void;
  fechaPreseleccionada: Date;
}

export function AddTransactionForm({ onSuccess, fechaPreseleccionada }: AddTransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState("GASTO")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Sincronizamos la fecha seleccionada con la hora actual para el orden cronológico
    const fechaFinal = new Date(fechaPreseleccionada)
    const ahora = new Date()
    fechaFinal.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds())

    // CREAMOS EL OBJETO PLANO UNIFICADO
    // Nota: 'categoria' es lo que espera la Action, 'clasificacion' es el nombre en el HTML del select
    const payload = {
      nombre: formData.get("nombre") as string,
      monto: Number(formData.get("monto")),
      tipo: tipo, // "INGRESO" o "GASTO"
      categoria: formData.get("clasificacion") as string, // <--- MAPEADO PARA EVITAR EL ERROR
      metodo: formData.get("metodo") as string,
      fecha: fechaFinal,
    }

    try {
      const result = await crearTransaccion(payload)
      
      if (result.success) {
        if (onSuccess) onSuccess()
      } else {
        alert(result.error || "Error al guardar")
      }
    } catch (error) {
      alert("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DrawerContent className="px-6 pb-10 max-w-md mx-auto rounded-t-[2.5rem] border-none shadow-2xl bg-white">
      <DrawerHeader className="pt-8">
        <DrawerTitle className="text-2xl font-black text-center tracking-tight text-slate-800">
          Nuevo Registro
        </DrawerTitle>
        <p className="text-center text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
          {fechaPreseleccionada.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </DrawerHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de Tipo */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
          <button
            type="button"
            onClick={() => setTipo("INGRESO")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              tipo === 'INGRESO' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <ArrowUpCircle size={18} /> Ingreso
          </button>
          <button
            type="button"
            onClick={() => setTipo("GASTO")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              tipo === 'GASTO' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <ArrowDownCircle size={18} /> Gasto
          </button>
        </div>

        <div className="space-y-4">
          <Input 
            name="nombre" 
            placeholder="Descripción (ej: Supermercado, Sueldo)" 
            className="h-14 text-base border-none bg-slate-50 rounded-2xl px-5 focus-visible:ring-2 focus-visible:ring-slate-200" 
            required 
          />
          
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl">$</span>
            <Input 
              name="monto" 
              type="number" 
              placeholder="0" 
              className="h-20 text-4xl font-black border-none bg-slate-50 rounded-[2rem] pl-10 text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Método</label>
              <select name="metodo" className="w-full h-14 rounded-2xl bg-slate-50 border-none px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-200 appearance-none">
                <option value="EFECTIVO">💵 Efectivo</option>
                <option value="TARJETA">💳 Tarjeta</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Categoría</label>
              <select name="clasificacion" className="w-full h-14 rounded-2xl bg-slate-50 border-none px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-200 appearance-none">
                <option value="VIDA">Vida</option>
                <option value="ACTIVO">Inversión</option>
                <option value="PASIVO">Deuda</option>
              </select>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className={`w-full h-16 rounded-[1.8rem] text-lg font-bold shadow-lg transition-all active:scale-95 ${
            tipo === 'INGRESO' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'
          } text-white`}
        >
          {loading ? "Registrando..." : "Confirmar Movimiento"}
        </Button>
      </form>
    </DrawerContent>
  )
}