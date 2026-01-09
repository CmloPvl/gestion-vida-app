"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"

// 1. Definimos qué datos va a recibir desde la página principal
interface CalendarioCardProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarioCard({ selectedDate, onDateChange }: CalendarioCardProps) {
  
  // 2. Función que se activa al hacer clic en un día
  const handleSelect = (newDate: Date | undefined) => {
    // Si el usuario hace clic en un día válido y no es una fecha futura
    if (newDate && newDate <= new Date()) {
      onDateChange(newDate);
    }
  };

  return (
    <Card className="p-2 border-none shadow-sm rounded-3xl bg-white flex justify-center">
      <Calendar
        mode="single"
        selected={selectedDate} // Usa la fecha que manda la página
        onSelect={handleSelect}  // Avisa a la página cuando cambia
        className="rounded-md border-none"
        // 3. BLOQUEO DE FUTURO: Deshabilita cualquier día después de hoy
        disabled={(date) => date > new Date()}
      />
    </Card>
  )
}