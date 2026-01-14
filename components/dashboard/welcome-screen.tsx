import { Wallet } from "lucide-react";
import { AuthModal } from "@/components/auth-modal";

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-slate-200">
        <Wallet className="h-12 w-12 text-emerald-400" />
      </div>
      <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-3 uppercase">Gestión Vida</h1>
      <p className="text-slate-500 text-sm max-w-65 mb-12 leading-relaxed font-medium">
        Toma el control total de tus finanzas y estrategia personal hoy mismo.
      </p>
      <div className="w-full max-w-xs space-y-4">
        <AuthModal type="login" />
        <AuthModal type="register" />
      </div>
    </div>
  );
}