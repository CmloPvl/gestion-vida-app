"use client"

import React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { NoSSR } from "@/components/ui/no-ssr"

// 1. Sincronizamos la interfaz con lo que pide el Page
interface AuditoriaProps {
  fecha: Date; // Antes: fechaSeleccionada
  onDateChange: (date: Date) => void; // Antes: setFechaSeleccionada
}

export function AuditoriaCalendario({ fecha, onDateChange }: AuditoriaProps) {
  
  // Manejador de selección con bloqueo de fechas futuras
  const handleSelect = (newDate: Date | undefined) => {
    // Si el usuario selecciona una fecha válida y no es futura
    if (newDate && newDate <= new Date()) {
      onDateChange(newDate);
    }
  };

  return (
    <section className="space-y-4">
      {/* Etiqueta de la sección */}
      <div className="flex items-center gap-2 px-1">
        <CalendarIcon className="w-4 h-4 text-slate-400" />
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
          Auditoría de Flujo
        </h3>
      </div>

      {/* Contenedor del Calendario */}
      <div className="bg-white rounded-[2.5rem] p-3 shadow-sm border border-slate-100 flex justify-center overflow-hidden">
        <NoSSR>
          <Calendar
            mode="single"
            selected={fecha} // Usamos el nombre unificado
            onSelect={handleSelect}
            className="rounded-3xl border-none p-0"
            // Deshabilitar días futuros para evitar registros erróneos
            disabled={(date) => date > new Date()}
            // Localización implícita y estilos limpios
            classNames={{
              day_selected: "bg-slate-900 text-white hover:bg-slate-800 hover:text-white focus:bg-slate-900 focus:text-white rounded-2xl",
              day_today: "bg-slate-100 text-slate-900 rounded-2xl",
            }}
          />
        </NoSSR>
      </div>
    </section>
  )
}