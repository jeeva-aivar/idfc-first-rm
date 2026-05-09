export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/morning-briefing',
    '/priority-stack',
    '/auto-actions',
    '/daily-debrief',
    '/leaderboard',
  ],
}
