import type { Browser } from "puppeteer-core";

export async function getBrowser(): Promise<Browser> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const puppeteer = await import("puppeteer");
    return puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      defaultViewport: { width: 1440, height: 900 },
    }) as unknown as Browser;
  } else {
    const [puppeteerCore, chromium] = await Promise.all([
      import("puppeteer-core"),
      import("@sparticuz/chromium"),
    ]);
    return puppeteerCore.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 1440, height: 900 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }
}
