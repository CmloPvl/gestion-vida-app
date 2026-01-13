"use client"

import { cn } from "@/lib/utils";
import { registrarUsuario } from "@/actions/auth";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { FinanceCard } from "@/components/dashboard/finance-card";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, Wallet, LogIn, UserPlus, LogOut, 
  Settings, ShieldCheck, PlusCircle, ArrowUpCircle, 
  ArrowDownCircle, PieChart
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Envolvemos todo en el Provider para que useSession funcione
export default function Home() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}

function DashboardContent() {
  const { data: session, status } = useSession();

  // 1. Estado de carga inicial
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Pantalla de Bienvenida (Mobile First)
  if (!session) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-500">
          <Wallet className="h-12 w-12 text-emerald-400" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-3">
          GESTIÓN VIDA
        </h1>
        <p className="text-slate-500 text-sm max-w-65 mb-12 leading-relaxed">
          Toma el control total de tus finanzas y estrategia personal hoy mismo.
        </p>

        <div className="w-full max-w-xs space-y-4">
          <AuthModal type="login" />
          <AuthModal type="register" />
        </div>

        <div className="mt-16 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <ShieldCheck size={14} className="text-emerald-500" />
          Seguridad de élite activa
        </div>
      </div>
    );
  }

  // 3. Dashboard Principal Profesional
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col pb-24">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
            <Wallet className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 italic">GV</span>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-100 h-10 w-10 border border-slate-200">
              <UserCircle className="h-6 w-6 text-slate-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] w-[92%] max-w-sm p-6">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-100">
                <UserCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">{session.user?.name}</h3>
              <p className="text-slate-400 text-xs mb-8">{session.user?.email}</p>
              
              <div className="w-full space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3 rounded-2xl h-12 border-slate-100 text-slate-600 font-bold">
                  <Settings size={18} /> Ajustes
                </Button>
                <Button onClick={() => window.location.href='/api/auth/signout'} variant="ghost" className="w-full justify-start gap-3 rounded-2xl h-12 text-rose-500 hover:bg-rose-50 font-bold">
                  <LogOut size={18} /> Cerrar Sesión
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 p-5 space-y-6 max-w-md mx-auto w-full">
        <section className="animate-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Hola, {session.user?.name?.split(' ')[0]}</h1>
          <p className="text-slate-400 text-sm font-medium">Balance general de hoy</p>
        </section>

        <FinanceCard />

        {/* RECOMENDACIÓN: ACCIONES RÁPIDAS (Básico en apps) */}
        <section className="grid grid-cols-4 gap-4 py-2">
          {[
            { icon: ArrowUpCircle, label: 'Ingreso', color: 'text-emerald-500' },
            { icon: ArrowDownCircle, label: 'Gasto', color: 'text-rose-500' },
            { icon: PlusCircle, label: 'Ahorro', color: 'text-blue-500' },
            { icon: PieChart, label: 'Plan', color: 'text-purple-500' },
          ].map((item, i) => (
            <button key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-90 transition-transform">
                <item.icon className={cn("h-6 w-6", item.color)} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6">
          <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 text-center shadow-sm">
            <ShieldCheck size={32} className="mb-4 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Próximos módulos</p>
            <p className="text-xs mt-1 font-medium text-slate-400">Análisis con Inteligencia Artificial</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Sticky para Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-10 py-5 flex justify-around items-center z-40">
        <button className="flex flex-col items-center gap-1 group">
          <Wallet size={20} className="text-emerald-600" />
          <span className="text-emerald-600 text-[9px] font-black uppercase">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-30 grayscale hover:opacity-100 transition-all">
          <PieChart size={20} className="text-slate-900" />
          <span className="text-slate-900 text-[9px] font-black uppercase">Reportes</span>
        </button>
      </nav>
    </div>
  );
}

function AuthModal({ type }: { type: 'login' | 'register' }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    if (type === 'register') {
      try {
        const result = await registrarUsuario(formData);
        if (result.error) {
          toast.error("Error", { description: result.error });
          setLoading(false);
        } else {
          toast.success("¡Cuenta creada!", { description: "Iniciando sesión..." });
          // Logueamos automáticamente tras registrar
          await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            callbackUrl: "/"
          });
        }
      } catch (err) {
        toast.error("Error de conexión");
        setLoading(false);
      }
    } else {
      const result = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Error", { description: "Credenciales inválidas" });
        setLoading(false);
      } else {
        toast.success("Bienvenido");
        window.location.reload();
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={type === 'login' ? 'default' : 'outline'} 
          className={cn(
            "w-full h-14 rounded-2xl font-bold gap-3 transition-all active:scale-95",
            type === 'login' ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white border-slate-200 text-slate-600"
          )}
        >
          {type === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          {type === 'login' ? 'Entrar al Sistema' : 'Empezar Gratis'}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] w-[92%] max-w-sm border-none shadow-2xl p-6 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-center font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
              {type === 'login' ? 'Acceso Seguro' : 'Crear Perfil'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {type === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase ml-2 text-slate-500">Nombre Completo</label>
                <Input name="name" placeholder="Tu nombre" className="rounded-2xl bg-slate-50 border-none h-12" required />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase ml-2 text-slate-500">Email</label>
              <Input name="email" type="email" placeholder="nombre@correo.com" className="rounded-2xl bg-slate-50 border-none h-12" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase ml-2 text-slate-500">Contraseña</label>
              <Input name="password" type="password" placeholder="••••••••" className="rounded-2xl bg-slate-50 border-none h-12" required />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-bold text-white shadow-lg mt-4">
              {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirmar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}