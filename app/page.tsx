"use client"

import { useSession, SessionProvider } from "next-auth/react"
// Importaciones por defecto (sin llaves) como pide Next.js 16
import WelcomeScreen from "@/components/dashboard/welcome-screen"
import DashboardClient from "@/components/dashboard/dashboard-client"

export default function Home() {
  return (
    <SessionProvider>
      <AuthGuard />
    </SessionProvider>
  )
}

function AuthGuard() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Si no hay sesión, vemos la bienvenida con el login/register
  if (!session) {
    return <WelcomeScreen />
  }

  // Si hay sesión, vemos el Dashboard (GV)
  return <DashboardClient session={session} />
}