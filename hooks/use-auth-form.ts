"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { authSchema } from "@/lib/validations/auth";
import { registrarUsuario } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function useAuthForm(type: 'login' | 'register', onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // 1. Google Auth: Siempre a la raíz
  const handleGoogleAuth = () => signIn("google", { callbackUrl: "/" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);
      
      // Validación con Zod (mantiene tu seguridad)
      const validation = authSchema.safeParse(data);
      if (!validation.success) {
        const fieldErrors: { [key: string]: string } = {};
        validation.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
        setLoading(false);
        return; 
      }

      if (type === 'register') {
        // Lógica de Registro
        const result = await registrarUsuario(formData);
        if (result?.error) throw new Error(result.error);

        toast.success("¡Cuenta creada!", {
          description: "Verifica tu Gmail para poder acceder a la plataforma.",
          duration: 6000,
        });
        
        if (onSuccess) onSuccess(); 
        
      } else {
        // Lógica de Login
        const result = await signIn("credentials", {
          email: (data.email as string).toLowerCase(),
          password: data.password as string,
          redirect: false,
        });

        if (result?.error) {
          const errorMessage = result.error === "CredentialsSignin" 
            ? "Email o contraseña incorrectos" 
            : "Debes confirmar tu correo para ingresar";
          throw new Error(errorMessage);
        }
        
        toast.success("¡Bienvenido a Gestión Vida!");
        
        // Cerramos el modal de Auth
        if (onSuccess) onSuccess();
        
        /**
         * CORRECCIÓN DE NAVEGACIÓN:
         * Usamos un pequeño delay y recarga forzada para que el AuthGuard 
         * de app/page.tsx detecte la sesión de inmediato y nos deje pasar.
         */
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }
      
    } catch (err: any) {
      toast.error(err.message || "Error inesperado");
      setErrors({ auth: err.message });
    } finally {
      setLoading(false);
    }
  }

  return { loading, errors, handleSubmit, handleGoogleAuth };
}