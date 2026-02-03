import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import db from "./prisma/client"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter" // <--- Agregado

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db), // <--- Conexión oficial con tu DB
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = (credentials.email as string).toLowerCase();

        const user = await db.user.findUnique({
          where: { email },
        })

        // Si el usuario no existe o se registró con Google (no tiene password)
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        // --- EL CANDADO DE VERIFICACIÓN ---
        if (!user.emailVerified) {
          throw new Error("EmailNotVerified") 
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/", 
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  // Nota: En Auth v5, la variable preferida es AUTH_SECRET, 
  // pero mantendremos tu referencia por compatibilidad.
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
})