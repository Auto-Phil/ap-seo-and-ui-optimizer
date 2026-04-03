import * as cheerio from "cheerio";
import type { ScrapedPage } from "./types";

async function scrapeDirectly(url: string): Promise<ScrapedPage> {
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

  const $raw = cheerio.load(rawHtml);
  const title = $raw("title").text().trim();
  const metaDescription =
    $raw('meta[name="description"]').attr("content")?.trim() ?? "";
  const h1 = $raw("h1").first().text().trim();

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

async function scrapeViaJina(url: string): Promise<ScrapedPage> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const res = await fetch(jinaUrl, {
    headers: {
      Accept: "application/json",
      "X-Return-Format": "markdown",
    },
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    throw new Error(`Jina returned status ${res.status}`);
  }

  const json = await res.json() as {
    code?: number;
    data?: {
      title?: string;
      description?: string;
      content?: string;
      url?: string;
    };
  };

  const data = json.data ?? {};
  const title = data.title ?? "";
  const metaDescription = data.description ?? "";
  const content = data.content ?? "";

  // Extract H1 from markdown — first # heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  const h1 = h1Match ? h1Match[1].trim() : title;

  let htmlContent = content;
  if (htmlContent.length > 15000) {
    htmlContent = htmlContent.slice(0, 15000) + "...";
  }

  return { url, htmlContent, title, metaDescription, h1 };
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  // Try direct fetch first — fast and works for most static sites
  let result: ScrapedPage;
  try {
    result = await scrapeDirectly(url);
  } catch (err) {
    // Direct fetch failed entirely — go straight to Jina
    console.warn("Direct fetch failed, trying Jina:", err);
    return scrapeViaJina(url);
  }

  // If direct fetch returned empty content (JS-rendered SPA), fall back to Jina
  const isEmpty = !result.title && !result.h1;
  const bodyTooThin = result.htmlContent.replace(/<[^>]*>/g, "").trim().length < 200;

  if (isEmpty || bodyTooThin) {
    console.log("Direct fetch returned thin content — falling back to Jina");
    try {
      return await scrapeViaJina(url);
    } catch (jinaErr) {
      console.warn("Jina fallback also failed:", jinaErr);
      // Return whatever we got from direct fetch rather than throwing
      return result;
    }
  }

  return result;
}
