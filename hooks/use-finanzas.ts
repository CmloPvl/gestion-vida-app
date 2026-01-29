"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { obtenerTransaccionesPorFecha, obtenerResumenMes, eliminarTransaccion } from "@/actions/transacciones"
import { toast } from "sonner"

export function useFinanzas() {
  const queryClient = useQueryClient()
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())

  // 1. Query Movimientos
  const { data: movimientos = [], isLoading: loadingMovimientos } = useQuery({
    queryKey: ["transacciones", fechaSeleccionada.toISOString().split('T')[0]],
    queryFn: () => obtenerTransaccionesPorFecha(fechaSeleccionada),
  })

  // 2. Query Resumen
  const { data: resumen = { ingresos: 0, gastos: 0 }, isLoading: loadingResumen } = useQuery({
    queryKey: ["resumen-mes"],
    queryFn: () => obtenerResumenMes(),
  })

  // 3. Mutación para eliminar
  const borrarMutation = useMutation({
    mutationFn: eliminarTransaccion,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["transacciones"] })
        queryClient.invalidateQueries({ queryKey: ["resumen-mes"] })
        toast.success("Eliminado correctamente")
      } else {
        toast.error(result.error || "No se pudo eliminar")
      }
    }
  })

  // 4. Función Refetch (Esta es la que faltaba en el return)
  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: ["transacciones"] })
    await queryClient.invalidateQueries({ queryKey: ["resumen-mes"] })
  }

  // IMPORTANTE: Asegúrate de que TODOS estos valores estén aquí
  return {
    fechaSeleccionada,
    setFechaSeleccionada,
    movimientos,
    resumen,
    loading: loadingMovimientos || loadingResumen,
    eliminar: borrarMutation.mutate,
    isDeleting: borrarMutation.isPending,
    refetch // <--- AGREGAR ESTO
  }
}