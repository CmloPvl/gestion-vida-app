"use client"

import React, { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { NoSSR } from "@/components/ui/no-ssr"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"

interface AuditoriaProps {
  fecha: Date;
  onDateChange: (date: Date) => void;
}

export function AuditoriaCalendario({ fecha, onDateChange }: AuditoriaProps) {
  const [month, setMonth] = useState<Date>(fecha);

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate && newDate <= new Date()) {
      onDateChange(newDate);
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-top-2 duration-700 w-full max-w-sm mx-auto">
      {/* TÍTULO Y CABECERA ESTILIZADA */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <CalendarIcon size={14} className="text-white" />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">
            Historial
          </h2>
        </div>
        <div className="h-[1px] flex-1 bg-slate-100 mx-4" />
      </div>

      <div className="bg-white rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
        <NoSSR>
          <Calendar
            mode="single"
            locale={es}
            selected={fecha}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            captionLayout="dropdown"
            fromYear={2023}
            toYear={new Date().getFullYear()}
            showOutsideDays={false}
            className="p-0 w-full"
            disabled={(date) => date > new Date()}
            classNames={{
              // ELIMINAMOS EL COMPORTAMIENTO EXTRAÑO DEL HEADER ORIGINAL
              caption: "flex flex-col gap-4 w-full relative mb-4",
              caption_label: "hidden", 
              
              // CONTENEDOR DE SELECTORES (MES Y AÑO)
              caption_dropdowns: "flex justify-between items-center w-full gap-2",
              dropdown_month: "flex-1", // El mes ocupa más espacio
              dropdown_year: "w-[85px]", // El año es más pequeño y fijo
              
              dropdown: cn(
                "w-full bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700",
                "py-2.5 px-3 rounded-xl border border-slate-100 outline-none appearance-none cursor-pointer",
                "hover:bg-indigo-50/50 hover:border-indigo-100 transition-all"
              ),

              // NAVEGACIÓN: Ahora la movemos abajo de los selectores o la integramos
              nav: "flex items-center justify-end gap-2 absolute top-0 right-0 h-[42px]", // Alineadas con los dropdowns
              nav_button: cn(
                "h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
              ),
              nav_button_previous: "static", 
              nav_button_next: "static",

              // GRILLA MATEMÁTICAMENTE CUADRADA
              table: "w-full border-collapse",
              head_row: "flex justify-between mb-3",
              head_cell: "text-slate-300 font-bold text-[9px] uppercase tracking-widest w-10 text-center",
              row: "flex w-full mt-1.5 justify-between",
              cell: "relative p-0 text-center focus-within:z-20",
              
              // EL DÍA
              day: cn(
                "h-10 w-10 p-0 font-bold text-[12px] rounded-xl transition-all flex items-center justify-center",
                "text-slate-600 hover:bg-slate-50 active:scale-95"
              ),
              day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 scale-105",
              day_today: "bg-indigo-50 text-indigo-600 border border-indigo-100/50",
              day_disabled: "text-slate-100 opacity-40 cursor-not-allowed",
            }}
          />
        </NoSSR>
      </div>

      <p className="text-center mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">
        Selecciona un día para auditar movimientos
      </p>
    </section>
  )
}