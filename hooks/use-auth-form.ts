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

  // 1. Cambiamos la redirección de Google al Home o Dashboard
  const handleGoogleAuth = () => signIn("google", { callbackUrl: "/" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);
      
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
        const result = await registrarUsuario(formData);
        
        if (result?.error) throw new Error(result.error);

        toast.success("Hemos enviado un correo a tu Gmail para verificar tu cuenta y puedas acceder a la app.", {
          duration: 8000,
        });
        
        if (onSuccess) onSuccess(); 
        
      } else {
        const result = await signIn("credentials", {
          email: (data.email as string).toLowerCase(),
          password: data.password as string,
          redirect: false,
        });

        // 2. Manejo específico del error del candado (AccessDenied)
        if (result?.error) {
          // Si el servidor devolvió un error de credenciales, verificamos si es por falta de verificación
          const errorMessage = result.error === "CredentialsSignin" 
            ? "Verifica tu email o clave incorrecta" 
            : "Debes confirmar tu correo para ingresar";
          
          throw new Error(errorMessage);
        }
        
        toast.success("¡Bienvenido a Gestión Vida!");
        if (onSuccess) onSuccess();
        
        // 3. Redirección limpia al Home (/) o Dashboard
        // Esto permite que el usuario elija el módulo antes de ir a finanzas
        router.push("/dashboard"); 
        router.refresh();
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