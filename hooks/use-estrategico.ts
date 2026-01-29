"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEstrategicoItems, createEstrategicoItem, deleteEstrategicoItem } from "@/actions/estrategico"
import { toast } from "sonner"

export type FinItem = { 
  id: string; 
  nombre: string; 
  monto: number; 
  subMonto?: number; 
  seccion: string 
}

export function useEstrategico() {
  const queryClient = useQueryClient()
  const [fraseUsuario, setFraseUsuario] = useState("La contabilidad es el lenguaje de los negocios y la libertad.")

  // 1. CARGAR DATOS DESDE DB (Con caché de TanStack)
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["estrategico-items"],
    queryFn: () => getEstrategicoItems(),
  })

  // 2. MUTACIÓN PARA AGREGAR
  const mutationAgregar = useMutation({
    mutationFn: createEstrategicoItem,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["estrategico-items"] })
        toast.success("Item agregado")
      } else {
        toast.error(res.error)
      }
    }
  })

  // 3. MUTACIÓN PARA QUITAR
  const mutationQuitar = useMutation({
    mutationFn: deleteEstrategicoItem,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["estrategico-items"] })
        toast.success("Item eliminado")
      }
    }
  })

  // --- Organizar los items por sección ---
  const ingresos = items.filter(i => i.seccion === 'ingresos')
  const gastos = items.filter(i => i.seccion === 'gastos')
  const activos = items.filter(i => i.seccion === 'activos')
  const pasivos = items.filter(i => i.seccion === 'pasivos')

  // --- Lógica de Cálculos Contables (Se mantiene igual, pero sobre datos reales) ---
  const totalActivos = activos.reduce((acc, curr) => acc + curr.monto, 0)
  const totalPasivos = pasivos.reduce((acc, curr) => acc + curr.monto, 0)
  const ingresoPasivo = activos.reduce((acc, curr) => acc + (curr.subMonto || 0), 0)
  const ingresosOperativos = ingresos.reduce((acc, curr) => acc + curr.monto, 0)
  
  const gastosMensuales = gastos.reduce((acc, curr) => acc + curr.monto, 0) + 
                          pasivos.reduce((acc, curr) => acc + (curr.subMonto || 0), 0)

  const ingresosTotales = ingresosOperativos + ingresoPasivo
  const ahorroMensual = ingresosTotales - gastosMensuales

  const calculos = {
    totalActivos,
    totalPasivos,
    ingresoPasivo,
    gastosMensuales,
    patrimonioNeto: totalActivos - totalPasivos,
    ahorroMensual: ahorroMensual,
    ratioIndependencia: gastosMensuales > 0 ? (ingresoPasivo / gastosMensuales) * 100 : 0,
    margenSeguridad: ingresosTotales > 0 ? (ahorroMensual / ingresosTotales) * 100 : 0
  }

  return {
    fraseUsuario, setFraseUsuario,
    ingresos, gastos, activos, pasivos,
    agregar: (seccion: any, item: any) => mutationAgregar.mutate({ ...item, seccion }),
    quitar: (seccion: any, id: string) => mutationQuitar.mutate(id),
    calculos,
    isLoading
  }
}