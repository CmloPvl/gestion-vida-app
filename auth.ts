import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
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

        // Retornamos el objeto que se guardará en el JWT inicial
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
      // Si el usuario acaba de iniciar sesión, pasamos el ID al token
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Inyectamos el ID del token directamente en la sesión
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
    maxAge: 30 * 24 * 60 * 60, // 30 días de sesión para no tener que loguearte a cada rato en el local
  },
  secret: process.env.NEXTAUTH_SECRET,
})