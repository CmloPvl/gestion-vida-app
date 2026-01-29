import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google" // Agregamos Google por si decides activarlo
import db from "./prisma/client"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        // Si no existe o no tiene clave (entró por Google)
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        // --- EL CANDADO ---
        // Bloqueamos aquí para que el error sea capturable por el hook
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
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token }) {
      // Podemos agregar datos extra al token aquí si fuera necesario
      return token
    },
  },
  pages: {
    signIn: "/",
    error: "/", 
  },
  session: { strategy: "jwt" },
})