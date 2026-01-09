import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";

export function FinanceCard() {
  return (
    <Link href="/finanzas" className="block w-full no-underline">
      <Card className="active:scale-95 transition-all duration-200 border-2 hover:border-emerald-500 shadow-sm cursor-pointer group">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          {/* Contenedor del Icono */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Wallet className="h-6 w-6" />
          </div>

          {/* Textos */}
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-800">Finanzas</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Resumen de flujos y gastos
            </CardDescription>
          </div>

          {/* Flecha indicadora */}
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </CardHeader>
      </Card>
    </Link>
  );
}