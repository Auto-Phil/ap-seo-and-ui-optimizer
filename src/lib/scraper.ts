import * as cheerio from "cheerio";
import type { ScrapedPage } from "./types";

function extractBrandColors(rawHtml: string): string[] {
  const hexMatches = rawHtml.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
  const colorCounts = new Map<string, number>();
  for (const c of hexMatches) {
    const normalized = c.toLowerCase();
    if (["#000000", "#ffffff", "#0a0a0a", "#f5f5f5", "#111111", "#eeeeee"].includes(normalized)) continue;
    colorCounts.set(normalized, (colorCounts.get(normalized) ?? 0) + 1);
  }
  return Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([color]) => color);
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`Page returned ${response.status}`);
  }

  const rawHtml = await response.text();

  const $raw = cheerio.load(rawHtml);
  const title = $raw("title").text().trim();
  const metaDescription = $raw('meta[name="description"]').attr("content")?.trim() ?? "";
  const h1 = $raw("h1").first().text().trim();

  const $ = cheerio.load(rawHtml);
  $("script, style, noscript, iframe, svg").remove();
  $("*").each((_, el) => {
    if (el.type === "tag") {
      const allowed = ["id", "href", "src", "alt", "title", "aria-label"];
      const attrs = Object.keys(el.attribs);
      for (const attr of attrs) {
        if (!allowed.includes(attr)) delete el.attribs[attr];
      }
    }
  });

  let htmlContent = $("body").html() ?? "";
  htmlContent = htmlContent.replace(/\s+/g, " ").trim();
  if (htmlContent.length > 15000) htmlContent = htmlContent.slice(0, 15000);

  const brandColors = extractBrandColors(rawHtml);

  return {
    url,
    htmlContent,
    title,
    metaDescription,
    h1,
    brandColors,
  };
}
