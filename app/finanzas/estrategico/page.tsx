import React from "react"
import { Home, ChevronLeft, Wallet, Receipt, CreditCard, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { IndicadorContable } from "@/components/finanzas/estrategico/IndicadorContable"
import { SectionContainer } from "@/components/finanzas/estrategico/SectionContainer"
import { getEstrategicoItems } from "@/actions/estrategico"

export default async function ResumenEstrategico() {
  const items = await getEstrategicoItems() || [];

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
        <Badge className="bg-slate-900 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full">
          Inteligencia Estratégica
        </Badge>
      </nav>

      <main className="px-6 pt-8 space-y-10 max-w-md mx-auto w-full">
        <IndicadorContable ratio={lib} margen={mrg} patrimonio={pat} ahorro={net} />

        <div className="space-y-12">
          <SectionContainer seccion="ingresos" title="Flujo Activo" detail="Ingresos por tiempo" icon={<Wallet size={18}/>} color="emerald" items={ingresos} ayuda="Tus ingresos por trabajo o ventas directas. El motor de tu economía." />
          <SectionContainer seccion="gastos" title="Costo de Vida" detail="Gastos operativos" icon={<Receipt size={18}/>} color="rose" items={gastos} ayuda="Gastos fijos y variables. Mantenerlos bajos aumenta tu libertad." />
          <SectionContainer seccion="activos" title="Patrimonio Productivo" detail="Activos que suman" icon={<Home size={18}/>} color="blue" items={activos} isAsset ayuda="Bienes que generan dinero sin tu tiempo. Aquí está tu jubilación real." />
          <SectionContainer seccion="pasivos" title="Obligaciones" detail="Pasivos & Deuda" icon={<CreditCard size={18}/>} color="slate" items={pasivos} isLiability ayuda="Deudas que quitan flujo. El objetivo es eliminarlas o que se paguen solas." />
        </div>

        {/* Estatus de Libertad y Cápsula de Sabiduría */}
        <section className="space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl flex flex-col items-center">
            <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-8">Estatus de Libertad</h4>
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                <circle 
                  cx="88" cy="88" r="78" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={490} 
                  strokeDashoffset={490 - (490 * lib) / 100}
                  strokeLinecap="round" 
                  className="text-indigo-400 transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-5xl font-black text-white tracking-tighter">{lib}%</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-8 text-center px-4 leading-relaxed uppercase tracking-widest">
              Tus activos productivos cubren el {lib}% de tus gastos totales.
            </p>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-xl"><Lightbulb size={20} className="fill-white/20" /></div>
              <h5 className="text-xs font-black uppercase tracking-widest">Hoja de Ruta</h5>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] leading-relaxed">
                <span className="font-black text-indigo-200">1. OPTIMIZAR:</span> Baja tu costo de vida para que el margen de ahorro crezca.
              </p>
              <p className="text-[11px] leading-relaxed">
                <span className="font-black text-indigo-200">2. ACUMULAR:</span> Compra activos que generen flujo mensual positivo.
              </p>
              <p className="text-[11px] leading-relaxed">
                <span className="font-black text-indigo-200">3. LIBERTAD:</span> Al llegar al 100%, dejas de trabajar por necesidad monetaria.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}