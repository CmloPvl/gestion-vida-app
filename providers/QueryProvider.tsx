'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from "next-auth/react"
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  // Creamos el cliente de TanStack Query una sola vez
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Los datos se guardan en caché por 1 minuto
        refetchOnWindowFocus: false, // Evita que se recargue todo al cambiar de pestaña
      },
    },
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Esto te muestra una consola de depuración en desarrollo */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  )
}