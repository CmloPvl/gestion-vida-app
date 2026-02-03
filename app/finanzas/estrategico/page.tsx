import React from "react"
import { Home, ChevronLeft, Wallet, Receipt, CreditCard, Lightbulb } from "lucide-react" // Corregido aquí
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { IndicadorContable } from "@/components/finanzas/estrategico/IndicadorContable"
import { SectionContainer } from "@/components/finanzas/estrategico/SectionContainer"
// Importamos el cliente de prisma directamente para asegurar la conexión
import db from "@/prisma/client" 
import { auth } from "@/auth"

export default async function ResumenEstrategico() {
  const session = await auth();
  const userId = session?.user?.id;

  // Si no hay usuario, devolvemos un estado vacío pero seguro
  if (!userId) return <div className="p-10 text-center font-black text-slate-400">SESIÓN NO ENCONTRADA</div>;

  // CONEXIÓN DIRECTA: Traemos todo de un solo golpe sin intermediarios
  const [items, transacciones] = await Promise.all([
    db.estrategicoItem.findMany({ 
      where: { userId: userId } 
    }),
    db.transaccion.findMany({ 
      where: { 
        userId: userId,
        // Filtramos desde el inicio del mes actual
        fecha: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      } 
    })
  ]);

  // Clasificación de items estratégicos
  const ingresos = items.filter(i => i.seccion === "ingresos");
  const gastos = items.filter(i => i.seccion === "gastos");
  const activos = items.filter(i => i.seccion === "activos");
  const pasivos = items.filter(i => i.seccion === "pasivos");

  // Resumen del Pad (Registro Diario)
  const resumenMes = {
    ingresos: transacciones.filter(t => t.tipo === "INGRESO").reduce((s, t) => s + t.monto, 0),
    gastos: transacciones.filter(t => t.tipo === "GASTO").reduce((s, t) => s + t.monto, 0)
  };

  // CALCULOS HÍBRIDOS (Estratégico + Pad)
  const incBase = ingresos.reduce((a, b) => a + b.monto, 0);
  const expBase = gastos.reduce((a, b) => a + b.monto, 0);
  
  const passInc = activos.reduce((a, b) => a + (b.subMonto || 0), 0);
  const debtCost = pasivos.reduce((a, b) => a + (b.subMonto || 0), 0);
  
  const iFull = incBase + passInc + resumenMes.ingresos;
  const gFull = expBase + debtCost + resumenMes.gastos;
  const net = iFull - gFull;
  
  const lib = gFull > 0 ? Math.min(Math.round((passInc / gFull) * 100), 100) : 0;
  const pat = activos.reduce((a, b) => a + (b.monto || 0), 0) - pasivos.reduce((a, b) => a + (b.monto || 0), 0);
  const mrg = iFull > 0 ? (net / iFull) * 100 : 0;

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
          <SectionContainer 
            seccion="ingresos" 
            title="Ingresos de Operación" 
            detail="Flujo por tiempo y ventas" 
            icon={<Wallet size={18}/>} 
            color="emerald" 
            items={ingresos} 
            montoExtra={resumenMes.ingresos} 
            ayuda="Tus ingresos activos. Es el dinero que generas por tu trabajo o ventas directas del mes." 
          />

          <SectionContainer 
            seccion="gastos" 
            title="Estructura de Costos" 
            detail="Gastos operativos de vida" 
            icon={<Receipt size={18}/>} 
            color="rose" 
            items={gastos} 
            montoExtra={resumenMes.gastos} 
            ayuda="Lo que te cuesta vivir. Mantener estos costos optimizados es la base de tu libertad financiera." 
          />

          <SectionContainer 
            seccion="activos" 
            title="Patrimonio Productivo" 
            detail="Bienes que generan valor" 
            icon={<Home size={18}/>} 
            color="blue" 
            items={activos} 
            isAsset 
            ayuda="Activos de capital: posesiones que ponen dinero en tu bolsillo cada mes o aumentan tu riqueza total." 
          />

          <SectionContainer 
            seccion="pasivos" 
            title="Deudas y Compromisos" 
            detail="Obligaciones financieras" 
            icon={<CreditCard size={18}/>} 
            color="slate" 
            items={pasivos} 
            isLiability 
            ayuda="Pasivos: compromisos que quitan dinero de tu flujo mensual. El objetivo es reducirlos al mínimo." 
          />
        </div>

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
        </section>
      </main>
    </div>
  )
}