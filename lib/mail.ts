import { Resend } from "resend";

// Exportamos la instancia para que pueda ser usada en otros sitios si es necesario
export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  // 1. Obtenemos el dominio y quitamos espacios en blanco por si acaso
  const rawDomain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const domain = rawDomain.trim();
  
  // 2. Construimos el link (asegúrate que la carpeta sea app/auth/new-verification)
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Gestion Vida <onboarding@resend.dev>", 
    to: email,
    subject: "🔐 Confirma tu cuenta - Gestión Vida",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; text-align: center; border: 1px solid #e2e8f0; border-radius: 20px;">
        <h2 style="color: #0f172a; margin-bottom: 10px;">¡Bienvenido a tu Gestión de Vida!</h2>
        <p style="color: #64748b; font-size: 16px;">Para activar tu acceso y comenzar a organizar tus finanzas y estrategia personal, confirma tu correo:</p>
        
        <div style="margin: 30px 0;">
          <a href="${confirmLink}" 
             style="background-color: #0f172a; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
            Confirmar Correo Electrónico
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 20px;">
          Este enlace expirará en 1 hora por seguridad.<br>
          Si no puedes hacer clic en el botón, copia y pega esto: <br>
          <span style="color: #3b82f6; word-break: break-all;">${confirmLink}</span>
        </p>
      </div>
    `,
  });
};