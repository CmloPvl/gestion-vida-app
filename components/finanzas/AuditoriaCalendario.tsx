"use client"

import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { NoSSR } from "@/components/ui/no-ssr"
import { cn } from "@/lib/utils"

interface AuditoriaProps {
  fecha: Date;
  onDateChange: (date: Date) => void;
}

export function AuditoriaCalendario({ fecha, onDateChange }: AuditoriaProps) {
  const handleSelect = (newDate: Date | undefined) => {
    if (newDate && newDate <= new Date()) {
      onDateChange(newDate);
    }
  };

  return (
    <section className="animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 flex justify-center">
        <NoSSR>
          <Calendar
            mode="single"
            selected={fecha}
            onSelect={handleSelect}
            className="p-0"
            disabled={(date) => date > new Date()}
            classNames={{
              day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all duration-300 shadow-md shadow-indigo-200 scale-110",
              day_today: "bg-indigo-50 text-indigo-600 rounded-xl font-bold",
              day: "h-10 w-10 p-0 font-medium text-slate-600 aria-selected:opacity-100 hover:bg-slate-50 rounded-xl transition-colors",
              head_cell: "text-slate-400 font-bold text-[10px] uppercase tracking-widest w-10",
              nav_button: "hover:bg-indigo-50 rounded-full transition-colors text-slate-400",
            }}
          />
        </NoSSR>
      </div>
    </section>
  )
}