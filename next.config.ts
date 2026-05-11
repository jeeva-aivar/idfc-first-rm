import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'idfc-rm-workspace-demo-secret-2026',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  },
  async rewrites() {
    const beUrl = process.env.CONVOGENT_BE_URL || 'https://demo.convogent.ai'
    const agentUrl = process.env.CONVOGENT_AGENT_URL || 'https://demo-agent.convogent.ai'
    return [
      {
        source: '/api/convogent/:path*',
        destination: `${beUrl}/api/:path*`,
      },
      {
        source: '/api/agent/:path*',
        destination: `${agentUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;
