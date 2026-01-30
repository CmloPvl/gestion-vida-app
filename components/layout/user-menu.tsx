"use client"

import { UserCircle, Settings, LogOut, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle, 
  DialogHeader 
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function UserMenu({ session }: { session: any }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Manejo ultra-seguro de la sesión
  const user = session?.user;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || "?");

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    // Redirigimos explícitamente a la raíz para evitar el 404 de /dashboard
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-2xl bg-white h-10 w-10 border border-slate-200 shadow-sm active:scale-90 transition-all hover:bg-slate-50"
        >
          <UserCircle className="h-6 w-6 text-slate-600" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2.5rem] w-[92%] max-w-sm p-8 border-none shadow-2xl bg-white focus:outline-none overflow-hidden">
        <DialogHeader>
          <DialogTitle className="hidden">Mi Perfil</DialogTitle>
        </DialogHeader>
        
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-slate-50 to-transparent -z-10" />

        <div className="flex flex-col items-center">
          {/* Avatar con inicial y anillo de estado */}
          <div className="relative mb-4">
            <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-300 ring-4 ring-white">
              <span className="text-2xl font-black text-emerald-400">
                {initial}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
          </div>
          
          <h3 className="font-bold text-xl text-slate-900 tracking-tight">
            {user?.name || "Usuario"}
          </h3>
          <p className="text-slate-400 text-xs mb-8 font-medium">
            {user?.email || "Cuenta personal"}
          </p>
          
          <div className="w-full space-y-2">
            <Button variant="outline" className="w-full justify-between gap-3 rounded-2xl h-14 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all px-6 group">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-slate-400 group-hover:rotate-45 transition-transform" /> 
                Ajustes
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </Button>
            
            <Button variant="outline" className="w-full justify-between gap-3 rounded-2xl h-14 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all px-6 group">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" /> 
                Seguridad
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </Button>

            <div className="h-4" />
            
            <Button 
              onClick={handleSignOut}
              disabled={isLoggingOut}
              variant="ghost" 
              className="w-full justify-center gap-3 rounded-2xl h-14 text-rose-500 font-black hover:bg-rose-50 transition-colors px-6 border border-transparent hover:border-rose-100"
            >
              {isLoggingOut ? (
                <div className="h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut size={18} /> 
                  CERRAR SESIÓN
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}