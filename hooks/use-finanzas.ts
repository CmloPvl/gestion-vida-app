"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { obtenerTransaccionesPorFecha, obtenerResumenMes, eliminarTransaccion } from "@/actions/transacciones"
import { toast } from "sonner"

export function useFinanzas() {
  const queryClient = useQueryClient()
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())

  // 1. Query Movimientos (Día específico)
  const { data: movimientos = [], isLoading: loadingMovimientos } = useQuery({
    queryKey: ["transacciones", fechaSeleccionada.toISOString().split('T')[0]],
    queryFn: () => obtenerTransaccionesPorFecha(fechaSeleccionada),
  })

  // 2. Query Resumen Híbrido (Sincronizado con el mes de la fecha seleccionada)
  const { data: resumen = { ingresos: 0, gastos: 0, progreso: 0, ingresosPasivos: 0, estado: "Cargando..." }, isLoading: loadingResumen } = useQuery({
    // CAMBIO: La llave ahora depende del mes/año seleccionado para que el balance se actualice
    queryKey: ["resumen-mes-hibrido", fechaSeleccionada.getMonth(), fechaSeleccionada.getFullYear()], 
    queryFn: () => obtenerResumenMes(fechaSeleccionada), // Pasamos la fecha para que el action sepa qué mes sumar
    refetchOnWindowFocus: true, 
  })

  // 3. Mutación para eliminar (Simplificada para asegurar limpieza)
  const borrarMutation = useMutation({
    mutationFn: (id: string) => eliminarTransaccion(id),
    onSuccess: (result) => {
      if (result.success) {
        // Limpiamos todo el cache de finanzas para forzar reconexión
        queryClient.invalidateQueries({ queryKey: ["transacciones"] })
        queryClient.invalidateQueries({ queryKey: ["resumen-mes-hibrido"] })
        toast.success("Movimiento eliminado");
      } else {
        toast.error(result.error || "No se pudo eliminar");
      }
    }
  })

  const refetch = async () => {
    await queryClient.refetchQueries({ queryKey: ["transacciones"] });
    await queryClient.refetchQueries({ queryKey: ["resumen-mes-hibrido"] });
  }

  return {
    fechaSeleccionada,
    setFechaSeleccionada,
    movimientos,
    resumen,
    loading: loadingMovimientos || loadingResumen,
    eliminar: borrarMutation.mutate,
    isDeleting: borrarMutation.isPending,
    refetch 
  }
}