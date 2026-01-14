"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { useFinanzas } from "@/hooks/use-finanzas"
import { AuditoriaCalendario } from "@/components/finanzas/AuditoriaCalendario"
import { BalanceCard } from "@/components/finanzas/BalanceCard"
import { ListaMovimientos } from "@/components/finanzas/ListaMovimientos"
import { BotonFlotanteAcciones } from "@/components/finanzas/BotonFlotanteAcciones"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function FinanzasPage() {
  const router = useRouter()
  const { 
    fechaSeleccionada, 
    setFechaSeleccionada, 
    movimientos, 
    resumen, 
    loading, 
    refetch 
  } = useFinanzas();

  // Función de refresco manual con feedback visual
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Datos actualizados");
    } catch (error) {
      toast.error("Error al sincronizar");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-36">
      <div className="max-w-md mx-auto p-5 space-y-6">
        
        {/* Barra Superior de Navegación */}
        <nav className="flex items-center justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/")}
            className="group -ml-2 gap-1 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Inicio</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-full h-8 w-8 text-slate-400"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </nav>

        {/* Header con Indicador de Estado */}
        <header className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Gestión de Flujo
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loading ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${loading ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {loading ? "Sincronizando..." : "Uruguay 660 • En línea"}
            </p>
          </div>
        </header>

        {/* Contenido Principal con Animación */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
          
          {loading && movimientos.length === 0 ? (
            <FinanzasSkeleton />
          ) : (
            <>
              <BalanceCard 
                ingresos={resumen.ingresos} 
                gastos={resumen.gastos} 
              />

              <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-100/50">
                <AuditoriaCalendario 
                  fecha={fechaSeleccionada} 
                  onDateChange={setFechaSeleccionada} 
                />
              </div>

              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Movimientos</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {movimientos.length} oper.
                  </span>
                </div>
                
                <ListaMovimientos 
                  movimientos={movimientos} 
                  fecha={fechaSeleccionada}
                  onMutation={refetch}
                />
              </section>
            </>
          )}
        </div>

        {/* Acciones UI - El Botón Flotante */}
        <BotonFlotanteAcciones 
          fechaSeleccionada={fechaSeleccionada}
          onSuccess={() => {
            refetch();
            toast.success("Operación registrada con éxito");
          }}
        />
      </div>
    </main>
  )
}

function FinanzasSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 w-full rounded-[2.5rem] bg-white border border-slate-100" />
      <Skeleton className="h-24 w-full rounded-[2rem] bg-white border border-slate-100" />
      <div className="space-y-3">
         <Skeleton className="h-20 w-full rounded-3xl bg-white/50" />
         <Skeleton className="h-20 w-full rounded-3xl bg-white/50" />
      </div>
    </div>
  );
}