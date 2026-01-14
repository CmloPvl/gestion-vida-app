"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
// CAMBIO: Se reemplaza ShieldLock por ShieldCheck
import { LogIn, UserPlus, ShieldCheck } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { registrarUsuario } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export function AuthModal({ type }: { type: 'login' | 'register' }) {
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
        toast.success("Bienvenido a Gestión Vida");
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
            type === 'login' 
              ? "bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          {type === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          {type === 'login' ? 'Entrar al Sistema' : 'Empezar Gratis'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2.5rem] w-[92%] max-w-sm border-none shadow-2xl p-8 bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              {/* CAMBIO: Se usa ShieldCheck aquí también */}
              <ShieldCheck className="text-slate-900" size={24} />
            </div>
            <DialogTitle className="text-center font-black uppercase text-[11px] tracking-[0.25em] text-slate-400">
              {type === 'login' ? 'Acceso Seguro' : 'Crear Perfil Personal'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {type === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase ml-3 text-slate-400 tracking-wider">Nombre Completo</label>
                <Input 
                  name="name" 
                  placeholder="Ej. Juan Pérez" 
                  className="rounded-2xl bg-slate-50 border-none h-13 px-5 focus-visible:ring-1 focus-visible:ring-slate-200" 
                  required 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase ml-3 text-slate-400 tracking-wider">Email</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="tu@email.com" 
                className="rounded-2xl bg-slate-50 border-none h-13 px-5 focus-visible:ring-1 focus-visible:ring-slate-200" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase ml-3 text-slate-400 tracking-wider">Contraseña</label>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className="rounded-2xl bg-slate-50 border-none h-13 px-5 focus-visible:ring-1 focus-visible:ring-slate-200" 
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-14 rounded-2xl bg-slate-900 font-bold text-white mt-4 shadow-lg shadow-slate-200 hover:bg-black transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                type === 'login' ? "Iniciar Sesión" : "Crear mi Cuenta"
              )}
            </Button>
            
            <p className="text-[10px] text-center text-slate-400 font-medium px-4">
              Tus datos están protegidos con cifrado de grado militar.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}