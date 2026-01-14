"use client"

import { UserMenu } from "./user-menu";
import { BottomNav } from "./bottom-nav";
import { 
  ArrowRight, 
  Wallet, 
  Plus, 
  Sparkles, 
  Layout, 
  TrendingUp 
} from "lucide-react";
import Link from "next/link";

export default function DashboardClient({ session, resumenInicial }: any) {
  const firstName = session.user?.name?.split(' ')[0];
  
  // Cálculo rápido para mostrar en el card
  const balance = (resumenInicial?.ingresos || 0) - (resumenInicial?.gastos || 0);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32 text-slate-900 font-sans selection:bg-slate-100">
      
      {/* HEADER: Refinado y fijo para Mobile */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 rotate-3">
            <span className="text-white font-black text-[10px]">GV</span>
          </div>
          <h1 className="text-[11px] font-black tracking-[0.2em] uppercase text-slate-400">Personal OS</h1>
        </div>
        <UserMenu session={session} />
      </header>

      <main className="flex-1 px-6 space-y-10 max-w-md mx-auto w-full">
        
        {/* SECCIÓN BIENVENIDA */}
        <section className="pt-6">
          <h2 className="text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Hola, <br />
            <span className="font-black italic underline decoration-slate-100 underline-offset-4">{firstName}</span>.
          </h2>
        </section>

        {/* MÓDULO PRINCIPAL: FINANZAS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Módulo Activo</h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Live</span>
            </div>
          </div>
          
          <Link href="/finanzas" className="group block no-underline">
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 active:scale-[0.97]">
              <div className="flex justify-between items-start mb-12">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/10">
                  <Wallet className="h-7 w-7 text-white" />
                </div>
                <div className="text-right text-white/60">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">Balance Mes</p>
                  <p className="text-xl font-mono font-bold text-white">
                    ${balance.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-2xl font-bold tracking-tighter text-white mb-1">Gestión Financiera</h4>
                <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                  <p>Presupuesto y Gastos</p>
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Decoración abstracta de fondo */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
            </div>
          </Link>
        </section>

        {/* PRÓXIMAMENTE: DISEÑO MÁS COMPACTO */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">En Desarrollo</h3>
          
          <div className="space-y-3">
            {/* Local Uruguay 660 */}
            <div className="flex items-center justify-between p-5 rounded-[1.8rem] bg-slate-50 border border-slate-100 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 text-slate-300">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-400">Uruguay 660</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Inventario & Negocio</p>
                </div>
              </div>
              <span className="text-[9px] font-bold py-1 px-2 rounded-lg bg-slate-200 text-slate-500 uppercase tracking-tighter">Próximamente</span>
            </div>

            {/* Salud */}
            <div className="flex items-center justify-between p-5 rounded-[1.8rem] bg-slate-50 border border-slate-100 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 text-slate-300">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-400">Salud & Rutina</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Métricas personales</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}