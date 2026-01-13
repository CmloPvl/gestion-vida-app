export { auth as middleware } from "@/auth"

export const config = {
  // Aquí proteges todas las rutas excepto la principal, 
  // las de la API de auth y archivos públicos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
}