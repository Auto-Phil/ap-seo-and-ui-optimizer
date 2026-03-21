import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer", "puppeteer-core", "@sparticuz/chromium", "cheerio"],
  outputFileTracingIncludes: {
    "/api/scrape": ["./node_modules/@sparticuz/chromium/**/*"],
    "/api/optimize": ["./node_modules/@sparticuz/chromium/**/*"],
  },
};

export default nextConfig;
