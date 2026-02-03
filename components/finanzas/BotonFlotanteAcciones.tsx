"use client"

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { AddTransactionForm } from "./AddTransactionForm"
import { FormularioEstrategico } from "./estrategico/FormularioEstrategico"
import { Plus, BarChart3, ArrowUpCircle, ArrowDownCircle, Home, CreditCard, ChevronLeft } from "lucide-react"
import Link from "next/link"

export function BotonFlotanteAcciones({ fechaSeleccionada, onSuccess }: { fechaSeleccionada: Date, onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<"menu" | "INGRESO" | "GASTO" | "estrategico">("menu")
  const [configEstrategico, setConfigEstrategico] = useState<{seccion: "activos" | "pasivos" | "ingresos" | "gastos", title: string, needsSubMonto: boolean} | null>(null)

  // Resetear al cerrar
  useEffect(() => { if (!isOpen) setView("menu") }, [isOpen])

  const abrirEstrategico = (seccion: any, title: string, needsSubMonto: boolean) => {
    setConfigEstrategico({ seccion, title, needsSubMonto });
    setView("estrategico");
  }

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess();
  }

  const fechaTexto = fechaSeleccionada.toLocaleDateString('es-CL', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <>
      <div className="fixed bottom-8 right-5 flex flex-col gap-4 items-end" style={{ zIndex: 9999 }}>
        <Link href="/finanzas/estrategico" className="w-12 h-12 bg-white text-slate-600 rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 active:scale-90 transition-all">
          <BarChart3 size={20} />
        </Link>
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center justify-center active:scale-95 transition-all">
          <Plus size={32} />
        </button>
      </div>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="px-6 pb-12 max-w-md mx-auto rounded-t-[3rem] border-none shadow-2xl bg-slate-50">
          
          {view !== "menu" && (
            <button onClick={() => setView("menu")} className="absolute left-6 top-8 text-slate-400 flex items-center gap-1 font-bold text-[10px] uppercase z-10">
              <ChevronLeft size={16} /> Volver
            </button>
          )}

          <DrawerHeader className="pt-10 pb-2">
            <DrawerTitle className="text-xl font-black text-center text-slate-900 tracking-tight">
              {view === "menu" ? "Gestión Financiera" : "Nuevo Registro"}
            </DrawerTitle>
            <p className="text-center text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1 italic">
              {fechaTexto}
            </p>
          </DrawerHeader>

          <div className="mt-4">
            {/* VISTA 1: MENÚ */}
            {view === "menu" && (
              <div className="grid grid-cols-2 gap-4">
                <MenuOption 
                  title="Ingreso Diario" 
                  icon={<ArrowUpCircle size={28}/>} 
                  color="emerald" 
                  onClick={() => setView("INGRESO")} 
                />
                <MenuOption 
                  title="Gasto Diario" 
                  icon={<ArrowDownCircle size={28}/>} 
                  color="rose" 
                  onClick={() => setView("GASTO")} 
                />
                <MenuOption 
                  title="Nuevo Activo" 
                  icon={<Home size={28}/>} 
                  color="blue" 
                  onClick={() => abrirEstrategico("activos", "Activo de Capital", true)} 
                />
                <MenuOption 
                  title="Nueva Deuda" 
                  icon={<CreditCard size={28}/>} 
                  color="slate" 
                  onClick={() => abrirEstrategico("pasivos", "Deuda o Compromiso", true)} 
                />
              </div>
            )}

            {/* VISTA 2: FORMULARIO DIARIO (PAD) */}
            {(view === "INGRESO" || view === "GASTO") && (
              <AddTransactionForm 
                tipoDefault={view} 
                fechaPreseleccionada={fechaSeleccionada} 
                onSuccess={handleSuccess} 
              />
            )}

            {/* VISTA 3: FORMULARIO ESTRATÉGICO (Ahora sincronizado con tus nuevos labels) */}
            {view === "estrategico" && configEstrategico && (
              <div className="bg-white p-2 rounded-[2.5rem] shadow-inner">
                 <FormularioEstrategico 
                    title={configEstrategico.title}
                    seccion={configEstrategico.seccion}
                    needsSubMonto={configEstrategico.needsSubMonto}
                    embedded={true}
                    onSuccess={handleSuccess}
                 />
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function MenuOption({ title, icon, color, onClick }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200"
  }
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all active:scale-95 ${colors[color]}`}>
      <div className="mb-3">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-center leading-tight">{title}</span>
    </button>
  )
}