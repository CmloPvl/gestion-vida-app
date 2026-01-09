"use client"

import React, { useState, useMemo } from "react"
import { 
  ArrowUpRight, ArrowDownRight, Home, Landmark, 
  ChevronLeft, Info, Plus, Trash2, Wallet, 
  ShieldCheck, AlertCircle, Zap, Scale, Coins,
  PiggyBank, Receipt, CreditCard
} from "lucide-react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// --- Tipos ---
type Item = { id: string; nombre: string; monto: number; subMonto?: number }

interface IndicadorProps {
  ratio: number;
  margen: number;
  patrimonio: number;
  ahorro: number;
}

// --- Sub-componente: Indicador Contable Mobile ---
function IndicadorContable({ ratio, margen, patrimonio, ahorro }: IndicadorProps) {
  const obtenerDiagnostico = () => {
    if (ratio >= 100) return { label: "Independencia", color: "text-emerald-500", icon: <Zap size={14} /> }
    if (margen > 30) return { label: "Estructura Saludable", color: "text-blue-500", icon: <ShieldCheck size={14} /> }
    if (ahorro < 0) return { label: "Déficit Operativo", color: "text-rose-500", icon: <AlertCircle size={14} /> }
    return { label: "Balance Estable", color: "text-slate-500", icon: <Scale size={14} /> }
  }
  const estado = obtenerDiagnostico();

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Coins size={12} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Patrimonio</p>
          </div>
          <p className="text-xl font-black text-slate-900">${patrimonio.toLocaleString('es-CL')}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <PiggyBank size={12} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Margen Seg.</p>
          </div>
          <p className={cn("text-xl font-black", ahorro >= 0 ? "text-slate-900" : "text-rose-600")}>
            {margen.toFixed(1)}%
          </p>
        </div>
        <div className="col-span-2 pt-4 border-t border-slate-50 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Diagnóstico</p>
            <div className={cn("flex items-center gap-2 text-xs font-black uppercase italic", estado.color)}>
              {estado.icon} {estado.label}
            </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Cashflow</p>
             <p className={cn("text-xs font-bold", ahorro >= 0 ? "text-emerald-600" : "text-rose-600")}>
               {ahorro >= 0 ? '+' : ''}${ahorro.toLocaleString('es-CL')}
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Componente Principal ---
export default function ResumenEstrategico() {
  const [ingresos, setIngresos] = useState<Item[]>([{ id: "1", nombre: "Salario Neto", monto: 4000 }])
  const [gastos, setGastos] = useState<Item[]>([{ id: "2", nombre: "Gastos Vida", monto: 2800 }])
  const [activos, setActivos] = useState<Item[]>([{ id: "3", nombre: "Inversiones", monto: 5000, subMonto: 150 }])
  const [pasivos, setPasivos] = useState<Item[]>([{ id: "4", nombre: "Créditos", monto: 12000, subMonto: 350 }])

  const totals = useMemo(() => {
    const inc = ingresos.reduce((a, b) => a + b.monto, 0)
    const exp = gastos.reduce((a, b) => a + b.monto, 0)
    const passInc = activos.reduce((a, b) => a + (b.subMonto || 0), 0)
    const debtCost = pasivos.reduce((a, b) => a + (b.subMonto || 0), 0)
    const gFull = exp + debtCost
    const net = (inc + passInc) - gFull
    const lib = Math.min(Math.round((passInc / gFull) * 100), 100) || 0
    const pat = activos.reduce((a, b) => a + b.monto, 0) - pasivos.reduce((a, b) => a + b.monto, 0)
    const mrg = inc > 0 ? (net / (inc + passInc)) * 100 : 0
    return { inc, exp, passInc, debtCost, gFull, net, lib, pat, mrg }
  }, [ingresos, gastos, activos, pasivos])

  const addItem = (seccion: string) => {
    const nombre = prompt("Concepto:")
    const monto = Number(prompt("Monto Base:"))
    if (!nombre || isNaN(monto)) return
    const nuevo: Item = { id: Math.random().toString(), nombre, monto }
    if (seccion === 'activos' || seccion === 'pasivos') {
      nuevo.subMonto = Number(prompt("Flujo Mensual (+/-):"))
    }
    if (seccion === 'ingresos') setIngresos([...ingresos, nuevo])
    if (seccion === 'gastos') setGastos([...gastos, nuevo])
    if (seccion === 'activos') setActivos([...activos, nuevo])
    if (seccion === 'pasivos') setPasivos([...pasivos, nuevo])
  }

  const deleteItem = (id: string, seccion: string) => {
    if (seccion === 'ingresos') setIngresos(ingresos.filter(i => i.id !== id))
    if (seccion === 'gastos') setGastos(gastos.filter(i => i.id !== id))
    if (seccion === 'activos') setActivos(activos.filter(i => i.id !== id))
    if (seccion === 'pasivos') setPasivos(pasivos.filter(i => i.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24">
      
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/finanzas">
          <Button variant="ghost" size="sm" className="gap-2 font-bold text-slate-600 hover:bg-transparent px-0">
            <ChevronLeft size={18} />
            <span>Calendario</span>
          </Button>
        </Link>
        <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase px-3 py-1">
          Auditoría v2.0
        </Badge>
      </nav>

      <main className="px-5 pt-6 space-y-6 max-w-md mx-auto">

        {/* GRÁFICO DE COBERTURA DESTACADO */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 text-slate-50/50">
            <Zap size={80} strokeWidth={3} />
          </div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Cobertura Estratégica</h4>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-50" />
              <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="14" fill="transparent" 
                strokeDasharray={452.4}
                strokeDashoffset={452.4 - (452.4 * totals.lib) / 100}
                strokeLinecap="round"
                className="text-indigo-600 transition-all duration-1000 ease-in-out" />
            </svg>
            <div className="absolute text-center leading-none">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{totals.lib}%</span>
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Logrado</p>
            </div>
          </div>
        </section>

        <IndicadorContable 
          ratio={totals.lib}
          margen={totals.mrg}
          patrimonio={totals.pat}
          ahorro={totals.net}
        />

        {/* GESTIÓN DE CUENTAS */}
        <div className="space-y-10 pt-4">
          <SectionContainer title="Ingresos" detail="(Trabajo activo)" icon={<Wallet size={18}/>} color="emerald" items={ingresos} onAdd={() => addItem('ingresos')} onDelete={(id: string) => deleteItem(id, 'ingresos')} />
          
          <SectionContainer title="Gastos" detail="(Costo de vida)" icon={<Receipt size={18}/>} color="rose" items={gastos} onAdd={() => addItem('gastos')} onDelete={(id: string) => deleteItem(id, 'gastos')} />
          
          <SectionContainer title="Activos" detail="(Tu maquinaria)" icon={<Home size={18}/>} color="blue" items={activos} onAdd={() => addItem('activos')} onDelete={(id: string) => deleteItem(id, 'activos')} isAsset />
          
          <SectionContainer title="Pasivos" detail="(Deuda operativa)" icon={<CreditCard size={18}/>} color="slate" items={pasivos} onAdd={() => addItem('pasivos')} onDelete={(id: string) => deleteItem(id, 'pasivos')} isLiability />
        </div>

      </main>
    </div>
  )
}

function SectionContainer({ title, detail, icon, color, items, onAdd, onDelete, isAsset, isLiability }: any) {
  const colorMap: any = {
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
    blue: "text-blue-600 bg-blue-50",
    slate: "text-slate-600 bg-slate-50"
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-2xl", colorMap[color])}>{icon}</div>
          <div>
            <h3 className="font-black text-slate-900 text-sm uppercase leading-none tracking-tight">{title}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{detail}</p>
          </div>
        </div>
        <Button onClick={onAdd} variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-slate-100 h-9 w-9">
          <Plus size={18} className="text-slate-600" />
        </Button>
      </header>

      <div className="space-y-2.5">
        {items.map((item: any) => (
          <Card key={item.id} className="border-none shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[1.5rem] bg-white group overflow-hidden">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={cn("w-1 h-8 rounded-full", colorMap[color].split(' ')[0])} />
                <div>
                  <p className="font-bold text-slate-700 text-sm tracking-tight">{item.nombre}</p>
                  {(isAsset || isLiability) && (
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      Valor: ${item.monto.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right leading-none">
                  <p className={cn("font-black text-sm", colorMap[color].split(' ')[0])}>
                    {isAsset ? '+' : isLiability ? '-' : ''}${ (isAsset || isLiability ? item.subMonto : item.monto)?.toLocaleString('es-CL') }
                  </p>
                  {(isAsset || isLiability) && <span className="text-[8px] text-slate-300 font-black uppercase">Mensual</span>}
                </div>
                <button onClick={() => onDelete(item.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}