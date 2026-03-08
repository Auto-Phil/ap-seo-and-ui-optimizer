import * as cheerio from "cheerio";
import type { ScrapedPage } from "./types";

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
    // Local dev: use puppeteer's bundled Chromium
    const puppeteer = await import("puppeteer");
    return puppeteer.default.launch({
      defaultViewport: { width: 1440, height: 900 },
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 15000,
    });

    if (response && (response.status() >= 400)) {
      throw new Error(`Page returned ${response.status()}`);
    }

    // Wait a bit for any late renders
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot — cap height at 3000px
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const clipHeight = Math.min(bodyHeight, 3000);

    const screenshotBuffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: 1440, height: clipHeight },
      fullPage: false,
    });

    const screenshotBase64 = Buffer.from(screenshotBuffer).toString("base64");

    // Get raw HTML for metadata extraction + cheerio
    const rawHtml = await page.content();

    // Extract metadata from raw HTML
    const $raw = cheerio.load(rawHtml);
    const title = $raw("title").text().trim();
    const metaDescription =
      $raw('meta[name="description"]').attr("content")?.trim() ?? "";
    const h1 = $raw("h1").first().text().trim();

    // Clean HTML for Claude
    const $ = cheerio.load(rawHtml);
    $("script, style, noscript, iframe, svg").remove();
    $("*").each((_, el) => {
      if (el.type === "tag") {
        const allowed = ["id", "href", "src", "alt", "title", "aria-label"];
        const attrs = Object.keys(el.attribs);
        for (const attr of attrs) {
          if (!allowed.includes(attr)) {
            delete el.attribs[attr];
          }
        }
      }
    });

    let htmlContent = $("body").html() ?? "";
    // Collapse whitespace
    htmlContent = htmlContent.replace(/\s+/g, " ").trim();
    // Truncate to 15,000 chars
    if (htmlContent.length > 15000) {
      htmlContent = htmlContent.slice(0, 15000);
    }

    return {
      url,
      screenshotBase64,
      htmlContent,
      title,
      metaDescription,
      h1,
    };
  } finally {
    if (browser) await browser.close();
  }
}
