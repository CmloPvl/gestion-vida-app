"use client"

import { Wallet, PieChart } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Finanzas', icon: Wallet, href: '/', active: pathname === '/' },
    { label: 'Salud', icon: PieChart, href: '#', active: false, disabled: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-10 py-5 flex justify-around items-center z-40">
      {navItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <Link 
            key={i} 
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              item.active ? "text-emerald-600 scale-110" : "text-slate-300",
              item.disabled && "opacity-30 grayscale cursor-not-allowed"
            )}
          >
            <Icon size={22} strokeWidth={item.active ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}