import * as cheerio from "cheerio";
import type { ScrapedPage } from "./types";

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Page returned status ${res.status}`);
  }

  const rawHtml = await res.text();

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

  return { url, htmlContent, title, metaDescription, h1 };
}
