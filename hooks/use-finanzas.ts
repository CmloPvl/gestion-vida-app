import { useState, useEffect, useCallback } from "react"
import { obtenerTransaccionesPorFecha, obtenerResumenMes } from "@/actions/transacciones"

export function useFinanzas() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())
  const [movimientos, setMovimientos] = useState([])
  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0 })
  const [loading, setLoading] = useState(true)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const [dataMovimientos, dataResumen] = await Promise.all([
        obtenerTransaccionesPorFecha(fechaSeleccionada),
        obtenerResumenMes()
      ])
      setMovimientos(dataMovimientos as any)
      setResumen(dataResumen)
    } catch (error) {
      console.error("Error en el flujo de datos:", error)
    } finally {
      setLoading(false)
    }
  }, [fechaSeleccionada])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  return {
    fechaSeleccionada,
    setFechaSeleccionada,
    movimientos,
    resumen,
    loading,
    refetch: cargarDatos
  }
}