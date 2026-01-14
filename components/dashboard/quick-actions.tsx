"use client"

import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, PlusCircle, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionModal } from "@/components/transactions/transaction-modal";

export function QuickActions() {
  // Estado para saber qué modal abrir (Ingreso o Gasto)
  const [activeModal, setActiveModal] = useState<'INCOME' | 'EXPENSE' | null>(null);

  const actions = [
    { 
      icon: ArrowUpCircle, 
      label: 'Ingreso', 
      color: 'text-emerald-500', 
      action: () => setActiveModal('INCOME') 
    },
    { 
      icon: ArrowDownCircle, 
      label: 'Gasto', 
      color: 'text-rose-500', 
      action: () => setActiveModal('EXPENSE') 
    },
    { 
      icon: PlusCircle, 
      label: 'Meta', 
      color: 'text-blue-500', 
      action: () => console.log("Próximamente") 
    },
    { 
      icon: PieChart, 
      label: 'Plan', 
      color: 'text-purple-500', 
      action: () => console.log("Próximamente") 
    },
  ];

  return (
    <>
      <section className="grid grid-cols-4 gap-4 py-2">
        {actions.map((item, i) => (
          <button 
            key={i} 
            onClick={item.action}
            className="flex flex-col items-center gap-2 group outline-none"
          >
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center transition-all active:scale-90 group-hover:shadow-md">
              <item.icon className={cn("h-6 w-6", item.color)} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {item.label}
            </span>
          </button>
        ))}
      </section>

      {/* Si activeModal no es null, mostramos el TransactionModal.
          Usamos 'open' y 'setOpen' que son los nombres estándar.
      */}
      {activeModal && (
        <TransactionModal 
          type={activeModal} 
          open={!!activeModal} 
          setOpen={(val: boolean) => !val && setActiveModal(null)} 
        />
      )}
    </>
  );
}