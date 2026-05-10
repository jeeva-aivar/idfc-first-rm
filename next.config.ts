import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inline server env vars at build time so Amplify Lambda picks them up reliably
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'idfc-rm-workspace-demo-secret-2026',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  },
};

export default nextConfig;
