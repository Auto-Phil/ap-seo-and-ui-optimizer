import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedPage, OptimizationResult } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert conversion rate optimizer and SEO specialist.
You rebuild homepages to maximize leads and search rankings.
Your output must always be valid, standalone HTML that renders beautifully in a browser.
You write sharp, direct marketing copy — never generic, always specific to the business.`;

function buildPrompt(scraped: ScrapedPage): string {
  return `Here is a real homepage I need you to optimize.

BUSINESS INFO:
- URL: ${scraped.url}
- Current page title: ${scraped.title}
- Current meta description: ${scraped.metaDescription}
- Current H1: ${scraped.h1}

CURRENT HTML:
${scraped.htmlContent}

Your task:
1. Analyze what's holding this page back (SEO gaps, weak CTAs, poor hierarchy, missing trust signals, slow-to-load structure)
2. Rebuild the page as a high-converting landing page

REQUIREMENTS FOR THE REBUILT PAGE:
- Keep the business's brand identity (name, industry, core offer) — don't genericize it
- Write a new H1 that leads with the primary keyword + value proposition in under 10 words
- Add an above-the-fold CTA with a specific, action-oriented label (not just "Contact Us")
- Include a social proof section (even if you have to suggest placeholder text for real testimonials)
- Structure content so the most important information appears first (inverted pyramid)
- Use semantic HTML5 elements (<header>, <main>, <section>, <footer>)
- Include inline CSS for styling — make it look clean and professional (dark or light theme matching the original brand)
- The page must look like it was designed by a professional agency, not a template
- Make it genuinely beautiful: proper spacing, typography scale, visual hierarchy
- Never use em dashes (—) anywhere in the copy; use commas, periods, or rewrite the sentence instead

SCORING:
Score the original page on:
- SEO fundamentals (keyword targeting, meta tags, heading structure): 0-25
- Conversion elements (CTA, trust signals, value prop clarity): 0-25
- UX structure (hierarchy, readability, mobile-friendliness indicators): 0-25
- Page performance potential (clean markup, no bloat): 0-25

Then score your optimized version on the same criteria. The after score MUST be higher than the before score.

CALLOUTS:
Identify exactly 4 concrete, actionable SEO/CRO recommendations for this specific site. These are advice for the site owner — not a description of what you did in the rebuild. Frame each as something they should do or fix.

Each callout must be:
- A short label (4-7 words) that names the specific problem (e.g. "Missing primary keyword in H1", "No above-fold CTA", "Meta description too generic")
- One sentence explaining exactly what to fix and why it will improve rankings or conversions — be specific to THIS site, not generic advice
- A type: "seo", "ux", "conversion", or "trust"

BAD example (do not do this): { "label": "Strong value proposition added", "description": "The page now leads with a clear value proposition." }
GOOD example: { "label": "H1 missing target keyword", "description": "Your H1 says 'Welcome' instead of leading with your core service — rewrite it to include your primary keyword and value prop in under 10 words." }

RESPONSE FORMAT — return ONLY valid JSON, no markdown, no explanation:
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
      "type": "seo"
    }
  ]
}`;
}

export function streamOptimize(scraped: ScrapedPage): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 5000,
          stream: true,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildPrompt(scraped) }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("streamOptimize error:", err);
        controller.enqueue(
          encoder.encode(JSON.stringify({ __error: String(err) }))
        );
        controller.close();
      }
    },
  });
}
