import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPage, OptimizationResult } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a blunt, senior SEO and conversion consultant writing a paid audit report.
Your job is to tell the business owner exactly what is broken and exactly what to do to fix it.
Never describe the current state without also prescribing the specific action to take.
Every recommendation must be actionable, specific to this business, and tied to a real outcome.
Do not hedge. Do not use filler. Return valid JSON only.`;

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
6. Identify 5 high-impact problems on this page and exactly how to fix each one. Each callout needs:
   - A label: the specific problem in 4–7 words (e.g. "No Local Keywords in Title Tag")
   - A description with exactly 3 pipe-separated bullets:
       Bullet 1: What is broken and why it is costing them rankings or conversions. Be specific — name the actual missing element or mistake.
       Bullet 2: The exact change to make. Name the specific word, phrase, tag, or element to add or replace.
       Bullet 3: The concrete business outcome this fix produces (more clicks, higher ranking, more leads, etc).
   - A type: "seo", "ux", "conversion", or "trust"

IMPORTANT RULES:
- Every bullet must prescribe an action, not just describe a problem.
- No em dashes (—). Use commas or periods instead.
- No filler phrases like "it is important to" or "this will help". Be direct.

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
