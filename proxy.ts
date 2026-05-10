import { withAuth } from 'next-auth/middleware'
import type { NextRequest } from 'next/server'

const SECRET = process.env.NEXTAUTH_SECRET ?? 'idfc-rm-workspace-demo-secret-2026'

const authMiddleware = withAuth({
  secret: SECRET,
  pages: { signIn: '/login' },
})

export function proxy(request: NextRequest, ...args: any[]) {
  return (authMiddleware as any)(request, ...args)
}

export const config = {
  matcher: [
    '/morning-briefing',
    '/priority-stack',
    '/auto-actions',
    '/daily-debrief',
    '/leaderboard',
  ],
}
