"use client"

import React, { useState, useMemo } from "react"
import { 
  ArrowUpRight, ArrowDownRight, Home, Landmark, 
  ChevronLeft, Plus, Trash2, Wallet, 
  ShieldCheck, AlertCircle, Zap, Scale, Coins,
  PiggyBank, Receipt, CreditCard, X, Info
} from "lucide-react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// --- Tipos ---
type Item = { id: string; nombre: string; monto: number; subMonto?: number }

// --- Sub-componente: Botón de Ayuda (Explicaciones) ---
function BotonAyuda({ titulo, explicacion }: { titulo: string, explicacion: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-slate-300 hover:text-indigo-500 transition-colors p-1">
          <Info size={14} />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] w-[90%] max-w-sm border-none shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="mx-auto bg-indigo-50 p-3 rounded-2xl w-fit text-indigo-600">
            <Info size={24} />
          </div>
          <DialogTitle className="text-center font-black uppercase text-sm tracking-widest text-slate-800">
            ¿Qué es {titulo}?
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 leading-relaxed pt-2">
            {explicacion}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

// --- Sub-componente: Indicador Contable ---
function IndicadorContable({ ratio, margen, patrimonio, ahorro }: any) {
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
          <div className="flex items-center gap-1 text-slate-400">
            <Coins size={12} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Patrimonio</p>
            <BotonAyuda titulo="Patrimonio" explicacion="Es la resta entre todo lo que posees (Activos) y todo lo que debes (Pasivos). Representa tu riqueza neta real hoy." />
          </div>
          <p className="text-xl font-black text-slate-900">${patrimonio.toLocaleString('es-CL')}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <PiggyBank size={12} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Margen Seg.</p>
            <BotonAyuda titulo="Margen de Seguridad" explicacion="Porcentaje de tus ingresos que queda libre tras gastos. Un margen alto protege el local de imprevistos." />
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
             <div className="flex items-center justify-end gap-1 mb-1">
               <p className="text-[9px] font-bold text-slate-400 uppercase">Cashflow</p>
               <BotonAyuda titulo="Cashflow" explicacion="Dinero sobrante neto al mes. Es lo que realmente puedes ahorrar o reinvertir en mercadería." />
             </div>
             <p className={cn("text-xs font-bold", ahorro >= 0 ? "text-emerald-600" : "text-rose-600")}>
               {ahorro >= 0 ? '+' : ''}${ahorro.toLocaleString('es-CL')}
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

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
    const mrg = (inc + passInc) > 0 ? (net / (inc + passInc)) * 100 : 0
    return { lib, pat, mrg, net }
  }, [ingresos, gastos, activos, pasivos])

  const handleAddItem = (seccion: string, newItem: Item) => {
    if (seccion === 'ingresos') setIngresos([...ingresos, newItem])
    if (seccion === 'gastos') setGastos([...gastos, newItem])
    if (seccion === 'activos') setActivos([...activos, newItem])
    if (seccion === 'pasivos') setPasivos([...pasivos, newItem])
  }

  const deleteItem = (id: string, seccion: string) => {
    if (seccion === 'ingresos') setIngresos(ingresos.filter(i => i.id !== id))
    if (seccion === 'gastos') setGastos(gastos.filter(i => i.id !== id))
    if (seccion === 'activos') setActivos(activos.filter(i => i.id !== id))
    if (seccion === 'pasivos') setPasivos(pasivos.filter(i => i.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24 font-sans">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/finanzas">
          <Button variant="ghost" size="sm" className="gap-2 font-bold text-slate-600 hover:bg-transparent px-0">
            <ChevronLeft size={18} />
            <span>Calendario</span>
          </Button>
        </Link>
        <Badge className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase px-3 py-1">Auditoría Pro</Badge>
      </nav>

      <main className="px-5 pt-6 space-y-8 max-w-md mx-auto">
        
        <IndicadorContable ratio={totals.lib} margen={totals.mrg} patrimonio={totals.pat} ahorro={totals.net} />

        <div className="space-y-10">
          <SectionContainer title="Ingresos" detail="(Trabajo)" icon={<Wallet size={18}/>} color="emerald" items={ingresos} onAdd={(item: Item) => handleAddItem('ingresos', item)} onDelete={(id: string) => deleteItem(id, 'ingresos')} ayuda="Dinero generado por tu actividad directa (sueldos o ventas del local)." />
          <SectionContainer title="Gastos" detail="(Vida)" icon={<Receipt size={18}/>} color="rose" items={gastos} onAdd={(item: Item) => handleAddItem('gastos', item)} onDelete={(id: string) => deleteItem(id, 'gastos')} ayuda="Costo mensual para mantener tu estilo de vida (comida, arriendo, servicios)." />
          <SectionContainer title="Activos" detail="(Inversiones)" icon={<Home size={18}/>} color="blue" items={activos} onAdd={(item: Item) => handleAddItem('activos', item)} onDelete={(id: string) => deleteItem(id, 'activos')} isAsset ayuda="Bienes que valen dinero y además te generan un flujo mensual (como rentas o dividendos)." />
          <SectionContainer title="Pasivos" detail="(Deudas)" icon={<CreditCard size={18}/>} color="slate" items={pasivos} onAdd={(item: Item) => handleAddItem('pasivos', item)} onDelete={(id: string) => deleteItem(id, 'pasivos')} isLiability ayuda="Deudas totales y la cuota que te sacan mensualmente del bolsillo." />
        </div>

        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cobertura Estratégica</h4>
            <BotonAyuda titulo="Cobertura" explicacion="Indica qué tan cerca estás de que tus ingresos pasivos paguen todos tus gastos de vida sin que tengas que trabajar." />
          </div>
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
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Libertad</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// --- Componente: Formulario de Registro Profesional ---
function FormularioAgregar({ onAdd, title, needsSubMonto }: { onAdd: (item: Item) => void, title: string, needsSubMonto: boolean }) {
  const [nombre, setNombre] = useState("")
  const [monto, setMonto] = useState("")
  const [subMonto, setSubMonto] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    if (!nombre || !monto) return
    onAdd({
      id: Math.random().toString(),
      nombre,
      monto: Number(monto),
      subMonto: needsSubMonto ? Number(subMonto) : 0
    })
    setNombre(""); setMonto(""); setSubMonto("");
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-slate-100 h-9 w-9">
          <Plus size={18} className="text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] w-[92%] max-w-sm border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center font-black uppercase text-xs tracking-widest text-slate-400">Nuevo Item: {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 px-1">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase ml-2 text-slate-400 tracking-tight">Nombre / Concepto</label>
            <Input placeholder="Ej: Venta Local Uruguay" value={nombre} onChange={(e) => setNombre(e.target.value)} className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase ml-2 text-slate-400 tracking-tight">Monto Total ($)</label>
            <Input type="number" placeholder="0" value={monto} onChange={(e) => setMonto(e.target.value)} className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-indigo-500" />
          </div>
          {needsSubMonto && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase ml-2 text-slate-400 tracking-tight">Flujo Mensual (+/-)</label>
              <Input type="number" placeholder="0" value={subMonto} onChange={(e) => setSubMonto(e.target.value)} className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-indigo-500" />
            </div>
          )}
          <Button onClick={handleSubmit} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-100 mt-2">
            Guardar Registro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SectionContainer({ title, detail, icon, color, items, onAdd, onDelete, isAsset, isLiability, ayuda }: any) {
  const colorMap: any = { emerald: "text-emerald-600 bg-emerald-50", rose: "text-rose-600 bg-rose-50", blue: "text-blue-600 bg-blue-50", slate: "text-slate-600 bg-slate-50" }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-2xl", colorMap[color])}>{icon}</div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{title}</h3>
              <BotonAyuda titulo={title} explicacion={ayuda} />
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{detail}</p>
          </div>
        </div>
        <FormularioAgregar title={title} onAdd={onAdd} needsSubMonto={isAsset || isLiability} />
      </header>

      <div className="space-y-2.5">
        {items.map((item: any) => (
          <Card key={item.id} className="border-none shadow-sm rounded-[1.5rem] bg-white group">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={cn("w-1 h-8 rounded-full", colorMap[color].split(' ')[0])} />
                <div>
                  <p className="font-bold text-slate-700 text-sm tracking-tight">{item.nombre}</p>
                  {(isAsset || isLiability) && (
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      Base: ${item.monto.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={cn("font-black text-sm", colorMap[color].split(' ')[0])}>
                  ${ (isAsset || isLiability ? item.subMonto : item.monto)?.toLocaleString('es-CL') }
                </p>
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