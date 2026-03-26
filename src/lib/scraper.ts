import type { ScrapedPage } from "./types";

function extractBrandColors(text: string): string[] {
  const hexMatches = text.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  let text: string;
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        "Accept": "text/plain",
        "X-Return-Format": "text",
      },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Jina returned ${response.status}`);
    text = await response.text();
  } finally {
    clearTimeout(timer);
  }

  // Jina text format:
  //   Title: Some Title
  //   URL Source: https://...
  //   ...content...
  const titleMatch = text.match(/^Title:\s*(.+)/m);
  const title = titleMatch?.[1]?.trim() ?? "";

  const h1Match = text.match(/^#\s+(.+)/m);
  const h1 = h1Match?.[1]?.trim() ?? "";

  // Trim content to keep Claude calls fast
  const content = text.length > 12000 ? text.slice(0, 12000) : text;

  return {
    url,
    htmlContent: content,
    title,
    metaDescription: "",
    h1,
    brandColors: extractBrandColors(text),
  };
}
