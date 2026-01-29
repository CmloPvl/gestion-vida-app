"use client"

import { UserMenu } from "./user-menu";
import { BottomNav } from "./bottom-nav";
import { 
  ArrowRight, 
  Wallet, 
  Sparkles, 
  TrendingUp,
  Target, // Icono para Estratégico
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardClient({ session, resumenInicial }: any) {
  const firstName = session.user?.name?.split(' ')[0] || "Usuario";
  const balance = (resumenInicial?.ingresos || 0) - (resumenInicial?.gastos || 0);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32 text-slate-900 font-sans selection:bg-slate-100">
      
      {/* HEADER: Identidad Gestión Vida */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 -rotate-6 transition-transform hover:rotate-0">
            <span className="text-white font-black text-xs tracking-tighter">GV</span>
          </div>
          <div>
            <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 leading-none mb-1">Sistema Operativo</h1>
            <p className="text-sm font-bold text-slate-900">Gestión Vida</p>
          </div>
        </div>
        <UserMenu session={session} />
      </header>

      <main className="flex-1 px-6 space-y-10 max-w-md mx-auto w-full">
        
        {/* BIENVENIDA DINÁMICA */}
        <section className="pt-4">
          <h2 className="text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Diseña tu <br />
            <span className="font-black italic underline decoration-slate-200 underline-offset-8">libertad</span>, {firstName}.
          </h2>
        </section>

        {/* CENTRO DE CONTROL: FINANZAS & ESTRATÉGICO */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Panel de Control</h3>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase">Sincronizado</span>
          </div>

          {/* CARD PRINCIPAL UNIFICADA */}
          <div className="relative overflow-hidden bg-slate-900 rounded-[2.8rem] p-8 shadow-2xl shadow-slate-300">
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Balance Disponible</p>
                <p className="text-2xl font-mono font-bold text-white">
                  ${balance.toLocaleString('es-CL')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Opción 1: Finanzas */}
              <Link href="/finanzas" className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <TrendingUp size={18} className="text-emerald-400" />
                  <span className="text-white font-semibold">Flujo de Caja</span>
                </div>
                <ArrowRight size={16} className="text-white/30 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Opción 2: Estratégico */}
              <Link href="/finanzas/estrategico" className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-blue-400" />
                  <span className="text-white font-semibold">Plan Estratégico</span>
                </div>
                <ArrowRight size={16} className="text-white/30 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Decoración de fondo */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />
          </div>
        </section>

        {/* SECCIÓN PRÓXIMAMENTE (MODULAR) */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Próximos Módulos</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 opacity-50">
               <div className="w-10 h-10 rounded-xl bg-white mb-3 flex items-center justify-center border border-slate-100">
                  <Sparkles size={18} className="text-slate-400" />
               </div>
               <p className="text-xs font-bold text-slate-500">Salud</p>
            </div>
            <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 opacity-50">
               <div className="w-10 h-10 rounded-xl bg-white mb-3 flex items-center justify-center border border-slate-100">
                  <Target size={18} className="text-slate-400" />
               </div>
               <p className="text-xs font-bold text-slate-500">Hábitos</p>
            </div>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}