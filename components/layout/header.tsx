"use client"

// Importación relativa dentro de la misma carpeta layout
import { UserMenu } from "./user-menu"

export function Header({ session }: { session: any }) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-xl px-6 pt-10 pb-4 flex items-center justify-between border-b border-slate-200/50">
      <div className="flex items-center gap-3">
        {/* Logo Identidad Personal */}
        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 -rotate-6">
          <span className="text-white font-black text-xs">GV</span>
        </div>
        
        {/* Status Indicador */}
        <div>
          <h1 className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-400 leading-none mb-1">Status</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold text-slate-900">En línea</p>
          </div>
        </div>
      </div>

      {/* Menú de Usuario con sesión de Auth.ts */}
      <UserMenu session={session} />
    </header>
  )
}