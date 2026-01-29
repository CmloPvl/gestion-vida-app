import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
// Importamos el nuevo componente de Providers
import Providers from "@/providers/QueryProvider"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestión Vida | Dashboard",
  description: "Sistema de gestión financiera y estratégica personal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Envolvemos children con Providers para habilitar NextAuth y TanStack Query */}
        <Providers>
          {children}
        </Providers>
        
        <Toaster 
          position="top-center" 
          richColors 
          expand={false}
          closeButton
        />
      </body>
    </html>
  );
}