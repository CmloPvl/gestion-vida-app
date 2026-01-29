"use client"

import { useState, useEffect } from "react"
import { useSession, SessionProvider } from "next-auth/react"
import WelcomeScreen from "@/components/dashboard/welcome-screen"
import DashboardClient from "@/components/dashboard/dashboard-client"
import { obtenerResumenMes } from "@/actions/transacciones"

/**
 * COMPONENTE RAÍZ
 */
export default function Home() {
  return (
    <SessionProvider>
      <AuthGuard />
    </SessionProvider>
  )
}

function AuthGuard() {
  const { data: session, status } = useSession()
  
  // Estado local para el resumen de finanzas
  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0 })
  const [loadingData, setLoadingData] = useState(true)

  // Efecto para cargar los datos reales de Prisma apenas haya sesión
  useEffect(() => {
    async function cargarDatos() {
      if (status === "authenticated") {
        const data = await obtenerResumenMes()
        setResumen(data)
        setLoadingData(false)
      }
    }
    cargarDatos()
  }, [status])

  // 1. Estado de carga: Mientras verifica sesión o trae datos de base de datos
  if (status === "loading" || (status === "authenticated" && loadingData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cargando Gestión Vida</p>
        </div>
      </div>
    )
  }

  // 2. Si NO hay sesión: Mostramos la bienvenida y formularios
  if (!session) {
    return <WelcomeScreen />
  }

  // 3. Si HAY sesión: Dashboard con datos reales de Prisma
  return (
    <DashboardClient 
      session={session} 
      resumenInicial={resumen} 
    />
  )
}