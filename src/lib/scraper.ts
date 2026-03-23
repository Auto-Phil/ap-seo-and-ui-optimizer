import * as cheerio from "cheerio";
import type { ScrapedPage } from "./types";

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
  if (!accessKey) throw new Error("SCREENSHOTONE_ACCESS_KEY is not set");

  // Fetch screenshot and raw HTML in parallel
  const params = new URLSearchParams({
    access_key: accessKey,
    url,
    full_page: "true",
    full_page_max_height: "3000",
    viewport_width: "1440",
    viewport_height: "900",
    format: "png",
    image_quality: "80",
  });

  const [screenshotRes, htmlRes] = await Promise.all([
    fetch(`https://api.screenshotone.com/take?${params}`, {
      signal: AbortSignal.timeout(50000),
    }),
    fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    }),
  ]);

  if (!screenshotRes.ok) {
    throw new Error(`Screenshot API returned ${screenshotRes.status}`);
  }
  if (!htmlRes.ok) {
    throw new Error(`Page returned status ${htmlRes.status}`);
  }

  const [screenshotBuffer, rawHtml] = await Promise.all([
    screenshotRes.arrayBuffer(),
    htmlRes.text(),
  ]);

  const screenshotBase64 = Buffer.from(screenshotBuffer).toString("base64");

  // Extract metadata
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
}
