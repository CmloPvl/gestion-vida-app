"use client"

import { LogIn, UserPlus, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react"; 
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useAuthForm } from "@/hooks/use-auth-form";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function AuthModal({ type }: { type: 'login' | 'register' }) {
  const [open, setOpen] = useState(false);
  
  // Conectamos el cierre automático: al terminar con éxito, setOpen pasa a false
  const { loading, errors, handleSubmit, handleGoogleAuth } = useAuthForm(type, () => setOpen(false));
  
  const searchParams = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setIsVerified(true);
    }
  }, [searchParams]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={type === 'login' ? 'default' : 'outline'} 
          className={cn(
            "w-full h-14 rounded-2xl font-bold gap-3 active:scale-95 transition-all shadow-sm", 
            type === 'login' 
              ? "bg-slate-900 text-white hover:bg-black" 
              : "bg-white text-slate-600 border-slate-200"
          )}
        >
          {type === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          {type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </Button>
      </DialogTrigger>
      
      {/* Ajuste de Max-Height para que no se salga de la pantalla en celulares */}
      <DialogContent className="rounded-[2rem] w-[95%] max-w-95 border-none p-0 bg-white shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        
        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {/* Banner de éxito */}
          {isVerified && type === 'login' && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
              <p className="text-emerald-700 text-[11px] font-medium leading-tight">
                ¡Email verificado! Ya puedes ingresar.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="flex flex-col items-center mb-2">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-3 shadow-lg rotate-3">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <DialogTitle className="text-center">
                <span className="block font-black uppercase text-[9px] tracking-[0.2em] text-slate-400 mb-1">
                  Gestión Vida
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {type === 'login' ? 'Bienvenido' : 'Nueva Cuenta'}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Button 
                type="button" 
                onClick={handleGoogleAuth} 
                variant="outline" 
                className="w-full h-11 rounded-xl border-slate-100 font-bold gap-3 active:scale-95 transition-all text-xs"
              >
                <FcGoogle size={18} /> 
                <span>Google</span>
              </Button>

              <div className="relative py-1 flex items-center">
                <div className="grow border-t border-slate-100"></div>
                <span className="shrink mx-3 text-[8px] font-bold text-slate-300 uppercase tracking-widest">o con email</span>
                <div className="grow border-t border-slate-100"></div>
              </div>
            </div>

            <div className="space-y-2">
              {type === 'register' && (
                <AuthInput field="name" label="Nombre" placeholder="Tu nombre" error={errors.name} />
              )}
              
              <AuthInput 
                field="email" 
                label="Email" 
                placeholder="correo@gmail.com" 
                type="email" 
                error={errors.email} 
              />
              
              <AuthInput field="password" label="Contraseña" placeholder="••••••••" type="password" error={errors.password} />

              {type === 'register' && (
                <AuthInput field="confirmPassword" label="Confirmar" placeholder="Repite la clave" type="password" error={errors.confirmPassword} />
              )}
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-13 rounded-xl bg-slate-900 font-bold text-white shadow-md active:scale-95 transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  type === 'login' ? 'Acceder ahora' : 'Crear Cuenta'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AuthInput({ field, label, placeholder, type = "text", error }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 tracking-tight">
        {label}
      </label>
      <div className="relative">
        <Input 
          name={field} 
          type={isPasswordField && showPassword ? "text" : type}
          placeholder={placeholder} 
          className={cn(
            "rounded-xl bg-slate-50 border-none h-11 px-4 text-sm transition-all focus-visible:ring-2 focus-visible:ring-slate-900/10", 
            error && "ring-1 ring-rose-500 bg-rose-50/50 text-rose-900"
          )} 
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-1"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && <p className="text-[9px] text-rose-500 ml-1 font-medium italic">{error}</p>}
    </div>
  );
}