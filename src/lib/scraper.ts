import * as cheerio from "cheerio";
import { getBrowser } from "./browser";
import type { ScrapedPage } from "./types";

export async function scrapePage(url: string): Promise<ScrapedPage> {
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Navigate with timeout
    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 15000,
    }).catch(() =>
      page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 })
    );

    if (response && response.status() >= 400) {
      throw new Error(`Page returned status ${response.status()}`);
    }

    // Wait a bit for any JS rendering
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot — cap height at 3000px
    const screenshotBuffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: 1440, height: 3000 },
    });
    const screenshotBase64 = Buffer.from(screenshotBuffer).toString("base64");

    // Get HTML
    const rawHtml = await page.content();

    // Extract metadata from raw HTML
    const $raw = cheerio.load(rawHtml);
    const title = $raw("title").text().trim();
    const metaDescription =
      $raw('meta[name="description"]').attr("content")?.trim() ?? "";
    const h1 = $raw("h1").first().text().trim();

    // Clean HTML for AI
    const $ = cheerio.load(rawHtml);
    $("script, style, noscript, iframe, svg, head").remove();
    $("*").each((_, el) => {
      if (el.type === "tag") {
        const allowed = ["id", "href", "src", "alt", "title", "type", "name"];
        const attribs = el.attribs;
        Object.keys(attribs).forEach((attr) => {
          if (!allowed.includes(attr)) delete attribs[attr];
        });
      }
    });

    // Collapse whitespace and truncate
    let htmlContent = $.html("body") ?? "";
    htmlContent = htmlContent.replace(/\s+/g, " ").trim();
    if (htmlContent.length > 15000) {
      htmlContent = htmlContent.slice(0, 15000) + "...";
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
