import { auth } from "@/auth"
import { NextRequest } from "next/server"

// @ts-ignore - Ignoramos el overload porque Auth.js maneja la req internamente
export const proxy = auth as any;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}