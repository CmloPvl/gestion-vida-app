import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. LISTA BLANCA: Rutas que siempre son visibles
  const isPublicRoute = 
    nextUrl.pathname === "/" || 
    nextUrl.pathname === "/auth/new-verification";

  // 2. Si es una ruta interna de NextAuth, dejar pasar siempre
  if (nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 3. SI ESTÁ LOGUEADO y trata de ir al Login (/), podrías mandarlo a otro lado
  // Pero por ahora, si es pública, dejamos pasar
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 4. PROTECCIÓN TOTAL: Si no está logueado y la ruta no es pública, al Inicio
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // 5. Headers de Seguridad (Se mantienen igual)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
});

export const config = {
  // Ignora archivos estáticos, imágenes y favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}