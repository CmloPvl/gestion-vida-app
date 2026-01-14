import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface BalanceProps {
  ingresos: number;
  gastos: number;
}

export function BalanceCard({ ingresos, gastos }: BalanceProps) {
  const balanceNeto = ingresos - gastos;

  return (
    <section className="bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-slate-200 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Balance Disponible</p>
            <h2 className="text-4xl font-black tracking-tighter">
              ${balanceNeto.toLocaleString('es-CL')}
            </h2>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl">
            <Wallet className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <ArrowUpRight size={14} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Ingresos</span>
            </div>
            <p className="text-base font-bold text-white">${ingresos.toLocaleString('es-CL')}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-rose-400 mb-1">
              <ArrowDownLeft size={14} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Gastos</span>
            </div>
            <p className="text-base font-bold text-white">${gastos.toLocaleString('es-CL')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}