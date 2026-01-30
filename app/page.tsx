"use client"

import { useState, useEffect } from "react"
import { useSession, SessionProvider } from "next-auth/react"
// Verificamos que las rutas apunten a components/dashboard/
import WelcomeScreen from "@/components/dashboard/welcome-screen"
import DashboardClient from "@/components/dashboard/dashboard-client"
import { obtenerResumenMes } from "@/actions/transacciones"

/**
 * COMPONENTE RAÍZ: Mantiene el SessionProvider para Next-Auth
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
    let isMounted = true; // Control para evitar errores si el componente se desmonta

    async function cargarDatos() {
      if (status === "authenticated") {
        try {
          const data = await obtenerResumenMes()
          if (isMounted) {
            setResumen(data)
            setLoadingData(false)
          }
        } catch (error) {
          console.error("Error cargando resumen:", error)
          if (isMounted) setLoadingData(false)
        }
      }
    }
    
    cargarDatos()
    return () => { isMounted = false } // Limpieza
  }, [status])

  // 1. Estado de carga: Pantalla de carga profesional con tu estética
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

  // 2. Si NO hay sesión: Redirige a la pantalla de bienvenida (Login/Registro)
  if (!session) {
    return <WelcomeScreen />
  }

  // 3. Si HAY sesión: Muestra el Dashboard con los datos inyectados
  return (
    <DashboardClient 
      session={session} 
      resumenInicial={resumen} 
    />
  )
}