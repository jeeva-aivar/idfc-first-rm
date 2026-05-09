import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'IDFC FIRST',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        if (credentials.email === 'demo@idfcfirst.com' && credentials.password === 'demo') {
          const rm = await prisma.rM.findUnique({ where: { id: 'rm-priya-sharma-001' } })
          if (!rm) return null
          return { id: rm.id, name: rm.name, email: rm.email }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.rmId = user.id
      return token
    },
    async session({ session, token }) {
      if (token.rmId) session.user.rmId = token.rmId as string
      return session
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
})

export { handler as GET, handler as POST }
