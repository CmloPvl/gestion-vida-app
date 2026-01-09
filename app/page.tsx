import { FinanceCard } from "@/components/dashboard/finance-card";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar Mobile */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight text-slate-800">GESTIÓN VIDA</span>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-6 w-6 text-slate-600" />
        </Button>
      </header>

      {/* Contenido principal con padding para pulgares (Mobile First) */}
      <main className="flex-1 p-4 space-y-6">
        <section>
          <h1 className="text-2xl font-extrabold text-slate-900">Hola, de nuevo</h1>
          <p className="text-slate-500 text-sm">¿Qué controlamos hoy?</p>
        </section>

        {/* Grid que en móvil es una columna y en desktop dos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FinanceCard />
          
          {/* Aquí irán otros módulos después */}
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
            <p className="text-sm font-medium">Próximos módulos</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Típico de Apps Mobile de Élite) */}
      <nav className="btm-nav border-t bg-white px-6 py-3 flex justify-around items-center">
        <span className="text-emerald-600 text-xs font-bold">Inicio</span>
        <span className="text-slate-400 text-xs font-medium">Historial</span>
        <span className="text-slate-400 text-xs font-medium">Perfil</span>
      </nav>
    </div>
  );
}