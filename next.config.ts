import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow the Next.js dev server to accept requests coming from other
   * devices on the local network (phones/tablets used for mobile QA)
   * and from common local tunnel/proxy origins. Keep this in sync with
   * whatever hosts are used to preview the dev build. */
  allowedDevOrigins: ["localhost", "127.0.0.1", "*.local-origin.dev"],
};

export default nextConfig;
