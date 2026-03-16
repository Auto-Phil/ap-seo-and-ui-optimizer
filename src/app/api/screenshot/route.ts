import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

async function getBrowser() {
  if (process.env.VERCEL) {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 1440, height: 900 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  } else {
    const puppeteer = await import("puppeteer");
    return puppeteer.default.launch({
      defaultViewport: { width: 1440, height: 900 },
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body." }, { status: 400 });
  }

  const { url } = body;
  if (!url) {
    return NextResponse.json({ success: false, error: "URL required." }, { status: 400 });
  }

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    // Brief pause for above-fold content to render
    await new Promise((r) => setTimeout(r, 1200));

    const screenshotBuffer = await page.screenshot({
      type: "jpeg",
      quality: 75,
      clip: { x: 0, y: 0, width: 1440, height: 900 },
      fullPage: false,
    });

    const screenshotBase64 = Buffer.from(screenshotBuffer).toString("base64");
    return NextResponse.json({ success: true, screenshotBase64 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[screenshot]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
