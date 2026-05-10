import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // NextAuth uses __Secure- prefix on HTTPS (production), plain name on HTTP (local)
  const token =
    request.cookies.get('__Secure-next-auth.session-token') ??
    request.cookies.get('next-auth.session-token')

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
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
