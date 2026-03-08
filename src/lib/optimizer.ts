import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPage, OptimizationResult } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert conversion rate optimizer and SEO specialist.
You rebuild homepages to maximize leads and search rankings.
Your output must always be valid, standalone HTML that renders beautifully in a browser.
You write sharp, direct marketing copy — never generic, always specific to the business.
Always use inline CSS for all styling — no external stylesheets, no Google Fonts, no CDN links.`;

function buildPrompt(scraped: ScrapedPage): string {
  return `Here is a real homepage I need you to optimize.

BUSINESS INFO:
- URL: ${scraped.url}
- Current page title: ${scraped.title || "(none)"}
- Current meta description: ${scraped.metaDescription || "(none)"}
- Current H1: ${scraped.h1 || "(none)"}

CURRENT HTML:
${scraped.htmlContent}

Your task:
1. Analyze what's holding this page back (SEO gaps, weak CTAs, poor hierarchy, missing trust signals)
2. Rebuild the page as a high-converting landing page

REQUIREMENTS FOR THE REBUILT PAGE:
- Keep the business's brand identity (name, industry, core offer) — don't genericize it
- Write a new H1 that leads with the primary keyword + value proposition in under 10 words
- Add an above-the-fold CTA with a specific, action-oriented label (not just "Contact Us")
- Include a social proof section (even if you suggest placeholder text for real testimonials)
- Structure content so the most important information appears first (inverted pyramid)
- Use semantic HTML5 elements (<header>, <main>, <section>, <footer>)
- ALL styling must be inline CSS — no external stylesheets, no CDN links, no Google Fonts
- The page must look like it was designed by a professional agency — not a template
- Make it visually striking with a clear color scheme derived from the original brand

SCORING:
Score the original page on:
- SEO fundamentals (keyword targeting, meta tags, heading structure): 0-25
- Conversion elements (CTA, trust signals, value prop clarity): 0-25
- UX structure (hierarchy, readability, mobile-friendliness indicators): 0-25
- Page performance potential (clean markup, no bloat): 0-25

Then score the optimized version on the same criteria.

CALLOUTS:
Identify 4-5 specific improvements you made. Each callout must be:
- A short label (4-7 words)
- One sentence explaining why it helps conversions or SEO
- A type: "seo", "ux", "conversion", or "trust"

RESPONSE FORMAT — return ONLY valid JSON, no markdown fences, nothing else:
{
  "optimizedHtml": "<!DOCTYPE html>...",
  "improvementScore": {
    "before": <total 0-100>,
    "after": <total 0-100>
  },
  "callouts": [
    {
      "label": "...",
      "description": "...",
      "type": "seo" | "ux" | "conversion" | "trust"
    }
  ]
}`;
}

function validateResult(result: OptimizationResult): boolean {
  return (
    typeof result.optimizedHtml === "string" &&
    result.optimizedHtml.includes("<!DOCTYPE html>") &&
    result.improvementScore.after > result.improvementScore.before &&
    Array.isArray(result.callouts) &&
    result.callouts.length >= 3
  );
}

async function callClaude(scraped: ScrapedPage): Promise<OptimizationResult> {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildPrompt(scraped) }],
  });

  const raw = (response.content[0] as { text: string }).text;
  // Strip any accidental ```json fences
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned) as OptimizationResult;
}

export async function optimizePage(scraped: ScrapedPage): Promise<OptimizationResult> {
  let result = await callClaude(scraped);

  if (!validateResult(result)) {
    // Retry once
    result = await callClaude(scraped);
    if (!validateResult(result)) {
      throw new Error("AI returned an invalid optimization result after retry.");
    }
  }

  return result;
}
