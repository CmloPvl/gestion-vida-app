import db from "@/prisma/client";
import { redirect } from "next/navigation";
import { XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>; 
}) {
  // 1. Extraer el token (obligatorio usar await en Next.js 15)
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <XCircle className="text-rose-500 mb-2" size={48} />
        <h1 className="text-xl font-bold">Token no encontrado</h1>
      </div>
    );
  }

  // 2. Buscar el token
  const existingToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!existingToken || new Date(existingToken.expires) < new Date()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <XCircle className="text-rose-500 mb-4" size={48} />
        <h1 className="text-xl font-bold">El enlace ha expirado</h1>
        <p className="text-slate-500 mt-2">Por favor, intenta registrarte nuevamente.</p>
      </div>
    );
  }

  // 3. Buscar al usuario
  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) return <div>Usuario no encontrado</div>;

  // 4. ABRIR EL CANDADO: Actualizamos al usuario
  await db.$transaction([
    db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    }),
    db.verificationToken.delete({
      where: { id: existingToken.id },
    }),
  ]);

  // 5. REDIRIGIR AL HOME
  // El parámetro verified=true hará que el modal de login muestre el check verde
  redirect("/?verified=true");
}