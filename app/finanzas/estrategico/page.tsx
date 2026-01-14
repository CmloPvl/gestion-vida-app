import React from "react"
import { Home, ChevronLeft, Wallet, Receipt, CreditCard } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { IndicadorContable } from "@/app/finanzas/estrategico/IndicadorContable"
import { SectionContainer } from "@/app/finanzas/estrategico/SectionContainer"
import { getEstrategicoItems } from "@/actions/estrategico"

// Nota: Quitamos el "use client" de arriba para que sea Server Component
export default async function ResumenEstrategico() {
  // Los datos se cargan directamente aquí, en el servidor
  const items = await getEstrategicoItems();

  const ingresos = items.filter(i => i.seccion === "ingresos");
  const gastos = items.filter(i => i.seccion === "gastos");
  const activos = items.filter(i => i.seccion === "activos");
  const pasivos = items.filter(i => i.seccion === "pasivos");

  const inc = ingresos.reduce((a, b) => a + b.monto, 0)
  const exp = gastos.reduce((a, b) => a + b.monto, 0)
  const passInc = activos.reduce((a, b) => a + (b.subMonto || 0), 0)
  const debtCost = pasivos.reduce((a, b) => a + (b.subMonto || 0), 0)
  
  const iFull = inc + passInc
  const gFull = exp + debtCost
  const net = iFull - gFull
  const lib = gFull > 0 ? Math.min(Math.round((passInc / gFull) * 100), 100) : 0
  const pat = activos.reduce((a, b) => a + b.monto, 0) - pasivos.reduce((a, b) => a + b.monto, 0)
  const mrg = iFull > 0 ? (net / iFull) * 100 : 0

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-32 font-sans">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-slate-100">
        <Link href="/finanzas" className="active:scale-95 transition-transform flex items-center gap-2">
            <ChevronLeft size={20} className="text-slate-900" />
            <span className="font-black text-[10px] uppercase tracking-tighter text-slate-400">Volver</span>
        </Link>
        <Badge className="bg-slate-900 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full">Inteligencia Estratégica</Badge>
      </nav>

      <main className="px-6 pt-8 space-y-10 max-w-md mx-auto w-full">
        <IndicadorContable ratio={lib} margen={mrg} patrimonio={pat} ahorro={net} />

        <div className="space-y-12">
          <SectionContainer title="Flujo Activo" detail="Ingresos por tiempo" icon={<Wallet size={18}/>} color="emerald" items={ingresos} ayuda="Ingresos directos." />
          <SectionContainer title="Costo de Vida" detail="Gastos operativos" icon={<Receipt size={18}/>} color="rose" items={gastos} ayuda="Gastos mensuales." />
          <SectionContainer title="Patrimonio Productivo" detail="Activos que suman" icon={<Home size={18}/>} color="blue" items={activos} isAsset ayuda="Bienes con valor." />
          <SectionContainer title="Obligaciones" detail="Pasivos & Deuda" icon={<CreditCard size={18}/>} color="slate" items={pasivos} isLiability ayuda="Deudas." />
        </div>

        <section className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl flex flex-col items-center">
          <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-8">Estatus de Libertad</h4>
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
              <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={490} strokeDashoffset={490 - (490 * lib) / 100}
                strokeLinecap="round" className="text-indigo-400 transition-all duration-500" />
            </svg>
            <div className="absolute text-center">
              <span className="text-5xl font-black text-white tracking-tighter">{lib}%</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}