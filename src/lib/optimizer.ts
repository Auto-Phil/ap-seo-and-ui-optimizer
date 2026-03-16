import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPage, OptimizationResult } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert conversion rate optimizer and SEO specialist.
You analyze homepages and produce specific, high-impact optimization recommendations.
Be precise and specific to this business — never generic. Return valid JSON only.`;

function buildPrompt(scraped: ScrapedPage): string {
  const colorBlock = scraped.brandColors.length > 0
    ? `Brand colors on this site: ${scraped.brandColors.slice(0, 5).join(", ")}\n\n`
    : "";

  return `Analyze this homepage and produce optimization recommendations.

BUSINESS INFO:
- URL: ${scraped.url}
- Current title: ${scraped.title || "(none)"}
- Current meta description: ${scraped.metaDescription || "(none)"}
- Current H1: ${scraped.h1 || "(none)"}
${colorBlock}
CURRENT PAGE CONTENT:
${scraped.htmlContent}

TASKS:
1. Write an optimized title tag (50–60 chars, leads with primary keyword + value proposition)
2. Write an optimized meta description (150–160 chars, specific to this business, includes a soft CTA)
3. Write an optimized H1 (under 10 words, leads with the primary keyword + clear value)
4. Write a specific above-fold CTA button label (action-oriented, specific — not "Contact Us" or "Learn More")
5. Score the original page on: SEO fundamentals (0–25), Conversion elements (0–25), UX structure (0–25), Performance potential (0–25). Then score the optimized version on the same criteria.
6. Identify 5 specific improvements you've made. Each callout needs:
   - A short label (4–7 words)
   - A 2–3 sentence description that explains the specific problem found, what was changed, and why it will improve rankings or conversions. Be concrete — name the actual issue, not a generic observation.
   - A type: "seo", "ux", "conversion", or "trust"

RESPONSE FORMAT — return ONLY valid JSON, no markdown fences, nothing else:
{
  "optimizedTitle": "...",
  "optimizedH1": "...",
  "optimizedMeta": "...",
  "optimizedCTA": "...",
  "improvementScore": { "before": <0-100>, "after": <0-100> },
  "callouts": [
    { "label": "...", "description": "...", "type": "seo" | "ux" | "conversion" | "trust" }
  ]
}`;
}

function validateResult(result: OptimizationResult): boolean {
  return (
    typeof result.optimizedH1 === "string" &&
    result.optimizedH1.length > 0 &&
    typeof result.optimizedTitle === "string" &&
    result.optimizedTitle.length > 0 &&
    typeof result.optimizedMeta === "string" &&
    typeof result.optimizedCTA === "string" &&
    result.improvementScore.after > result.improvementScore.before &&
    Array.isArray(result.callouts) &&
    result.callouts.length >= 3
  );
}

async function callClaude(scraped: ScrapedPage): Promise<OptimizationResult> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildPrompt(scraped) }],
  });

  const raw = (response.content[0] as { text: string }).text;

  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace > 0 || lastBrace < cleaned.length - 1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned) as OptimizationResult;
}

export async function optimizePage(scraped: ScrapedPage): Promise<OptimizationResult> {
  let result = await callClaude(scraped);

  if (!validateResult(result)) {
    result = await callClaude(scraped);
    if (!validateResult(result)) {
      throw new Error("AI returned an invalid optimization result after retry.");
    }
  }

  return result;
}
