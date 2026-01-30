"use client"

// Importamos desde las nuevas rutas que definimos
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { QuickActions } from "./quick-actions"; 
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  TrendingUp,
  Target,
  ShieldCheck,
  CreditCard,
  Wallet
} from "lucide-react";
import Link from "next/link";

export default function DashboardClient({ session, resumenInicial }: any) {
  // Extraemos el nombre con seguridad para evitar el error al cerrar sesión
  const firstName = session?.user?.name?.split(' ')[0] || "Usuario";
  
  const ingresos = resumenInicial?.ingresos || 0;
  const gastos = resumenInicial?.gastos || 0;
  const flujoNeto = ingresos - gastos;
  
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-32 text-slate-900 font-sans selection:bg-slate-100">
      
      {/* 1. Header Global con UserMenu incorporado */}
      <Header session={session} />

      {/* 2. Cuerpo con el diseño de Gestión Vida */}
      <main className="flex-1 px-6 space-y-8 max-w-md mx-auto w-full pt-6">
        
        {/* Bienvenida dinámica */}
        <section className="space-y-1">
          <p className="text-slate-500 text-sm font-medium">Hola, {firstName}</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            Tu libertad financiera <br />
            comienza <span className="text-indigo-600">hoy.</span>
          </h2>
        </section>

        {/* Card Contable Negra (Diseño Minimalista) */}
        <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-slate-400/20">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-1">Flujo Neto del Mes</p>
                <h3 className="text-3xl font-bold text-white tracking-tighter">
                  {formatCurrency(flujoNeto)}
                </h3>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="text-emerald-400 h-5 w-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem]">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpRight size={14} className="text-emerald-400" />
                  <span className="text-[9px] font-black uppercase text-white/40">Ingresos</span>
                </div>
                <p className="text-sm font-bold text-white">{formatCurrency(ingresos)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem]">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownRight size={14} className="text-rose-400" />
                  <span className="text-[9px] font-black uppercase text-white/40">Gastos</span>
                </div>
                <p className="text-sm font-bold text-white">{formatCurrency(gastos)}</p>
              </div>
            </div>

            {/* Enlaces de Gestión */}
            <div className="space-y-2">
              <Link href="/finanzas" className="flex items-center justify-between bg-white text-slate-900 p-4 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                   <TrendingUp size={18} className="text-indigo-600" />
                   <span>Gestionar Flujo Diario</span>
                </div>
                <ArrowUpRight size={16} className="text-slate-400" />
              </Link>
              
              <Link href="/finanzas/estrategico" className="flex items-center justify-between bg-white/10 text-white p-4 rounded-2xl font-bold text-sm border border-white/10 active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                   <Target size={18} className="text-blue-400" />
                   <span>Plan Estratégico Global</span>
                </div>
                <ArrowUpRight size={16} className="text-white/30" />
              </Link>
            </div>
          </div>
          {/* Efecto de brillo de fondo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] -mr-10 -mt-10" />
        </section>

        {/* Acciones Rápidas (Modales Zod) */}
        <QuickActions />

        {/* Sección de Patrimonio */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patrimonio & Metas</h3>
            <div className="h-px flex-1 bg-slate-200 mx-4" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="group bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm active:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <CreditCard size={20} className="text-indigo-600" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">Deudas</p>
              <p className="text-sm font-bold text-slate-900">Control Pasivo</p>
            </div>
            <div className="group bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm active:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                <Wallet size={20} className="text-amber-600" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">Ahorro</p>
              <p className="text-sm font-bold text-slate-900">Fondo de Paz</p>
            </div>
          </div>
        </section>

        {/* Notificación de Insight */}
        <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-[2rem] flex gap-4 items-center mb-4">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <Sparkles className="text-indigo-600 h-5 w-5" />
          </div>
          <p className="text-[11px] font-medium text-indigo-900 leading-relaxed">
            <span className="font-bold">Insight:</span> Estás optimizando tu flujo un 12% mejor que el mes anterior.
          </p>
        </div>
      </main>

      {/* 3. Navegación Inferior Global */}
      <BottomNav />
    </div>
  );
}