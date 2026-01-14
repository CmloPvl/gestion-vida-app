"use client"

import { useState } from "react";
import { toast } from "sonner";
import { crearTransaccion } from "@/actions/transacciones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";

// 1. Props corregidas para recibir el control desde QuickActions
interface Props {
  type: 'INCOME' | 'EXPENSE';
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function TransactionModal({ type, open, setOpen }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("type", type); 

    try {
      const result = await crearTransaccion(formData);

      if (result.success) {
        toast.success(type === 'INCOME' ? "Ingreso registrado" : "Gasto registrado");
        setOpen(false); // Cerramos el modal usando la prop del padre
      } else {
        toast.error("Error", { description: result.error });
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Eliminamos el DialogTrigger porque el botón está en QuickActions */}
      <DialogContent className="rounded-[2.5rem] w-[92%] max-w-sm p-8 border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-center font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
            {type === 'INCOME' ? 'Nuevo Ingreso Personal' : 'Nuevo Gasto Personal'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase ml-2 text-slate-500">Monto ($)</label>
            <Input 
              name="amount" 
              type="number" 
              placeholder="0" 
              className="rounded-2xl bg-slate-50 border-none h-14 text-xl font-bold text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-200" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase ml-2 text-slate-500">Categoría</label>
            <Select name="category" required>
              <SelectTrigger className="rounded-2xl bg-slate-50 border-none h-12 focus:ring-1 focus:ring-slate-200">
                <SelectValue placeholder="Selecciona una" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                {type === 'INCOME' ? (
                  <>
                    <SelectItem value="Sueldo">Sueldo / Honorarios</SelectItem>
                    <SelectItem value="Inversión">Inversiones</SelectItem>
                    <SelectItem value="Otros">Otros Ingresos</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Alimentación">Alimentación</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                    <SelectItem value="Salud">Salud</SelectItem>
                    <SelectItem value="Suscripciones">Suscripciones</SelectItem>
                    <SelectItem value="Ocio">Ocio y Diversión</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase ml-2 text-slate-500">Descripción (Opcional)</label>
            <Input 
              name="description" 
              placeholder="Ej: Netflix, Cena, etc." 
              className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-1 focus-visible:ring-slate-200" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className={`w-full h-14 rounded-2xl font-bold text-white shadow-lg mt-4 transition-all active:scale-95 ${
              type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-slate-900 hover:bg-black shadow-slate-100'
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Registrar ahora"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}