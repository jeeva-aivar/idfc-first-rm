import { withAuth } from 'next-auth/middleware'
import type { NextRequest } from 'next/server'

const authMiddleware = withAuth({
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
