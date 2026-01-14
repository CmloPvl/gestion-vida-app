"use client"
import { useState } from "react"

export type FinItem = { id: string; nombre: string; monto: number; subMonto?: number }

export function useEstrategico() {
  const [fraseUsuario, setFraseUsuario] = useState("La contabilidad es el lenguaje de los negocios y la libertad.")
  
  const [ingresos, setIngresos] = useState<FinItem[]>([])
  const [gastos, setGastos] = useState<FinItem[]>([])
  const [activos, setActivos] = useState<FinItem[]>([])
  const [pasivos, setPasivos] = useState<FinItem[]>([])

  const agregar = (lista: 'ingresos'|'gastos'|'activos'|'pasivos', item: FinItem) => {
    const setters = { ingresos: setIngresos, gastos: setGastos, activos: setActivos, pasivos: setPasivos }
    setters[lista](prev => [...prev, item])
  }

  const quitar = (lista: 'ingresos'|'gastos'|'activos'|'pasivos', id: string) => {
    const setters = { ingresos: setIngresos, gastos: setGastos, activos: setActivos, pasivos: setPasivos }
    setters[lista](prev => prev.filter(i => i.id !== id))
  }

  // --- Lógica de Cálculos Contables ---
  const totalActivos = activos.reduce((acc, curr) => acc + curr.monto, 0)
  const totalPasivos = pasivos.reduce((acc, curr) => acc + curr.monto, 0)
  
  // El ingreso pasivo viene del "subMonto" de los activos (ej: renta de un depto)
  const ingresoPasivo = activos.reduce((acc, curr) => acc + (curr.subMonto || 0), 0)
  
  // Los ingresos operativos (sueldo, etc)
  const ingresosOperativos = ingresos.reduce((acc, curr) => acc + curr.monto, 0)
  
  // Gastos totales = Gastos fijos + pagos mensuales de pasivos (subMonto de deudas)
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
    // Ratio de Independencia: ¿Qué % de mis gastos cubren mis activos?
    ratioIndependencia: gastosMensuales > 0 ? (ingresoPasivo / gastosMensuales) * 100 : 0,
    // Margen de Seguridad: ¿Qué % del ingreso total queda libre?
    margenSeguridad: ingresosTotales > 0 ? (ahorroMensual / ingresosTotales) * 100 : 0
  }

  return {
    fraseUsuario, setFraseUsuario,
    ingresos, gastos, activos, pasivos,
    agregar, quitar, calculos
  }
}