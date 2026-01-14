"use client"

import { UserCircle, Settings, LogOut, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle, 
  DialogHeader 
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

export function UserMenu({ session }: { session: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-100 h-10 w-10 border border-slate-200 active:scale-95 transition-all">
          <UserCircle className="h-6 w-6 text-slate-600" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2.5rem] w-[92%] max-w-sm p-8 border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="hidden">Mi Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          {/* Avatar con inicial o icono */}
          <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-4 shadow-xl shadow-slate-200">
            <span className="text-2xl font-black text-emerald-400">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <h3 className="font-bold text-xl text-slate-900 tracking-tight">
            {session?.user?.name}
          </h3>
          <p className="text-slate-400 text-xs mb-8 font-medium">
            {session?.user?.email}
          </p>
          
          <div className="w-full space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3 rounded-2xl h-14 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors px-6">
              <Settings size={18} className="text-slate-400" /> 
              Ajustes del Sistema
            </Button>
            
            <Button variant="outline" className="w-full justify-start gap-3 rounded-2xl h-14 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors px-6">
              <Shield size={18} className="text-slate-400" /> 
              Seguridad
            </Button>

            <div className="h-4" /> {/* Espaciador */}
            
            <Button 
              onClick={() => signOut({ callbackUrl: "/" })} 
              variant="ghost" 
              className="w-full justify-start gap-3 rounded-2xl h-14 text-rose-500 font-bold hover:bg-rose-50 transition-colors px-6"
            >
              <LogOut size={18} /> 
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}