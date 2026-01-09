"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, Plus, BarChart3, ArrowUpRight, ArrowDownLeft, Wallet, Calendar } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" 
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import { NoSSR } from "@/components/ui/no-ssr"

import { ListaFlujo, Movimiento } from "@/components/finanzas/lista-flujo"
import { CalendarioCard } from "@/components/finanzas/calendario-card"
import { AddTransactionForm } from "@/components/finanzas/AddTransactionForm"

import { obtenerTransaccionesPorFecha, obtenerResumenMes } from "@/actions/transacciones"

export default function FinanzasPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0 })
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())

  const cargarDatos = useCallback(async () => {
    try {
      const transacciones = await obtenerTransaccionesPorFecha(fechaSeleccionada);
      const resumenMes = await obtenerResumenMes();
      setMovimientos(transacciones as Movimiento[]);
      setResumen(resumenMes); 
    } catch (error) {
      console.error("Error al sincronizar finanzas:", error);
    }
  }, [fechaSeleccionada]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const balanceNeto = resumen.ingresos - resumen.gastos;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] text-slate-900 font-sans">
      
      {/* Navbar Superior Compacta */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-slate-100 p-2 rounded-xl">
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </div>
          <span className="font-bold text-base tracking-tight">Gestión Vida</span>
        </Link>
        <Badge variant="outline" className="border-slate-200 text-slate-500 font-semibold px-3 py-1 rounded-full">
          Finanzas
        </Badge>
      </header>

      <main className="flex-1 px-5 pt-6 pb-32 space-y-7 max-w-md mx-auto w-full">
        
        {/* Card de Balance Estilo 'Neo-Bank' */}
        <section className="bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-slate-200 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Balance Disponible</p>
                <h2 className="text-4xl font-black tracking-tighter">
                  ${balanceNeto.toLocaleString('es-CL')}
                </h2>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <ArrowUpRight size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Ingresos</span>
                </div>
                <p className="text-base font-bold text-white">${resumen.ingresos.toLocaleString('es-CL')}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                  <ArrowDownLeft size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Gastos</span>
                </div>
                <p className="text-base font-bold text-white">${resumen.gastos.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Auditoría con Calendario Compacto */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auditoría de Flujo</h3>
          </div>
          <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
            <NoSSR>
              <CalendarioCard selectedDate={fechaSeleccionada} onDateChange={setFechaSeleccionada} />
            </NoSSR>
          </div>
        </section>

        {/* Listado de Movimientos Estilo Inbox */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-slate-800">Movimientos Recientes</h2>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
              {fechaSeleccionada.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-2">
            <ListaFlujo movimientos={movimientos} /> 
          </div>
        </section>
      </main>

      {/* Botonera Inferior Flotante (Action Bar) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
          <Link href="/finanzas/estrategico" className="flex-1">
            <Button variant="outline" className="w-full h-14 rounded-2xl bg-white border-slate-200 shadow-xl font-bold text-slate-600 gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Estratégico
            </Button>
          </Link>

          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="h-14 w-14 rounded-2xl bg-slate-900 hover:bg-black text-white shadow-xl flex items-center justify-center p-0 transition-transform active:scale-90">
                <Plus className="h-7 w-7" />
              </Button>
            </DrawerTrigger>
            <AddTransactionForm onSuccess={() => {
              setIsDrawerOpen(false);
              cargarDatos();
            }} />
          </Drawer>
        </div>
      </div>
    </div>
  )
}