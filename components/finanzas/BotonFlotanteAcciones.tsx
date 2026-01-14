"use client"

import { useState, useEffect } from "react"
import { Drawer } from "@/components/ui/drawer"
import { AddTransactionForm } from "./AddTransactionForm"
import { Plus, BarChart3 } from "lucide-react"
import Link from "next/link"

interface BotonFlotanteProps {
  fechaSeleccionada: Date;
  onSuccess: () => void;
}

export function BotonFlotanteAcciones({ fechaSeleccionada, onSuccess }: BotonFlotanteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Capa de botones fija */}
      <div className="fixed bottom-8 right-5 flex flex-col gap-4 items-end" style={{ zIndex: 9999 }}>
        <Link 
          href="/finanzas/estrategico" 
          className="w-12 h-12 bg-white text-slate-600 rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 active:scale-90 transition-all"
        >
          <BarChart3 size={20} />
        </Link>

        <button 
          onClick={() => setIsOpen(true)} // Apertura manual
          className="w-16 h-16 bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={32} />
        </button>
      </div>

      {/* El Drawer fuera del div fijo para evitar conflictos de scroll/clic */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <AddTransactionForm 
          fechaPreseleccionada={fechaSeleccionada}
          onSuccess={() => {
            setIsOpen(false)
            onSuccess()
          }} 
        />
      </Drawer>
    </>
  )
}