import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["puppeteer-core", "puppeteer", "@sparticuz/chromium"],
  experimental: {
    outputFileTracingIncludes: {
      "/api/scrape": ["./node_modules/@sparticuz/chromium/**/*"],
    },
  },
};

export default nextConfig;
