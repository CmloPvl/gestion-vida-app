"use client"

import { useEffect, useState } from "react"

/**
 * Componente NoSSR
 * Se utiliza para envolver componentes que causan errores de hidratación
 * (como Calendarios o Gráficos) asegurando que solo se rendericen en el cliente.
 */
export function NoSSR({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  // useEffect solo se ejecuta en el navegador (cliente)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mientras el servidor está cargando, mostramos un "esqueleto" (Skeleton)
  // h-[350px] es la medida estándar para que el calendario no salte al aparecer
  if (!isClient) {
    return (
      <div 
        className="w-full h-87.5 animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-xl" 
        aria-hidden="true"
      />
    )
  }

  return <>{children}</>
}