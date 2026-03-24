# Handoff — ap-seo-and-ui-optimizer

**Session date:** 2026-03-23
**Status:** Blocked — Anthropic API credits issue

---

## What We Were Building

A free homepage audit tool (w.max) that fetches any URL, sends the HTML to Claude, and returns a rebuilt version with before/after scores and improvement callouts. Built with Next.js, deployed on Vercel, owned under Auto-Phil LLC.

---

## Where We Stopped

The app is fully built and deployed. The only thing blocking it from working is an **Anthropic API credit balance error**. The code is correct and streaming is working — Claude is rejecting the request before generating anything.

---

## The Blocker

Error from Vercel logs:
```
Error: 400 {"type":"error","error":{"type":"invalid_request_error",
"message":"Your credit balance is too low to access the Anthropic API."}}
```

**Organization ID in the error:** `afd758e0-b7e4-4de8-be22-5c95f23447fb`

Zack added $5 to console.anthropic.com but the error persisted. Most likely cause: the API key in Vercel belongs to a different workspace/org than where the credits were added.

**Next action to resolve:**
1. Go to console.anthropic.com → API Keys
2. Find the key named `apseoui-api-key`
3. Confirm it belongs to org `afd758e0-b7e4-4de8-be22-5c95f23447fb`
4. Go to Plans & Billing on THAT org and confirm balance shows $5+
5. If balance is there but still failing, create a brand new API key from that org, update it in Vercel env vars, and redeploy

---

## What Is Done

- Full Next.js app built and deployed to Vercel
- **Scraper** (`src/lib/scraper.ts`) — plain `fetch` + cheerio, no browser, sub-second
- **Optimizer** (`src/lib/optimizer.ts`) — Claude Sonnet 4-6, streaming via `messages.create({ stream: true })`, errors encoded as data (no crash)
- **Streaming route** (`src/app/api/optimize/route.ts`) — returns `ReadableStream`, frontend accumulates and parses JSON on close
- **UI** — Auto-Phil teal color scheme, "Did you know" facts on loading screen, single-panel optimized output with score reveal animation + callouts
- **GitHub** — https://github.com/Auto-Phil/ap-seo-and-ui-optimizer (main branch)
- Build is clean, all TypeScript passes

---

## What Is NOT Done Yet

- Unblocking the Anthropic API credits (see blocker above)
- End-to-end test on a real URL once credits are confirmed
- Verify the score reveal animation looks good in production

---

## Next Action (Start Here)

> Resolve the Anthropic billing issue: go to console.anthropic.com, confirm the `apseoui-api-key` key and the $5 credit are on the same org (`afd758e0`). If unsure, create a fresh API key, paste it into Vercel → Settings → Environment Variables → `ANTHROPIC_API_KEY`, and redeploy.

---

## Key Decisions Made This Session

- Removed Puppeteer entirely — was causing every timeout/crash on Vercel serverless
- Removed ScreenshotOne — also too slow for Vercel's limits
- Removed "before" screenshot panel — now shows only the AI-optimized page + report
- Scraper is now a plain `fetch()` call — no external APIs, no browser, sub-second
- Switched from Opus to Sonnet for speed
- Implemented streaming so Claude's output flows token-by-token (no 60s wall)
- Brand colors: Auto-Phil teal `#2e8b7a` across all accents

---

## Files Touched This Session

| File | What Changed |
|------|--------------|
| `src/lib/scraper.ts` | Plain fetch + cheerio, no Puppeteer or ScreenshotOne |
| `src/lib/optimizer.ts` | Streaming via create({stream:true}), errors as encoded data |
| `src/lib/types.ts` | Removed screenshotBase64 from ScrapedPage |
| `src/app/api/scrape/route.ts` | maxDuration reduced to 15s |
| `src/app/api/optimize/route.ts` | Returns ReadableStream response |
| `src/app/analyze/page.tsx` | Reads stream, accumulates, parses JSON on close |
| `src/components/RevealAnimation.tsx` | Redesigned: score count-up → page reveal → callouts |
| `src/components/ComparisonView.tsx` | Single panel: full-width iframe + callouts + lead capture |
| `src/app/globals.css` | Auto-Phil teal color scheme |
| `src/components/LoadingScreen.tsx` | Did-you-know facts rotating every 5s |
| `next.config.ts` | Stripped to empty config (no Puppeteer packages needed) |
| `HANDOFF.md` | This file |

---

## Known Issues / Watch Out For

- Anthropic credits must be on the same org as the API key — this tripped us up
- Vercel Hobby plan has 60s function limit — streaming keeps the connection alive past this, but if streaming itself fails the limit still applies
- The `SCREENSHOTONE_ACCESS_KEY` env var in Vercel is no longer needed and can be deleted
- Puppeteer, puppeteer-core, @sparticuz/chromium have all been removed from package.json

---

## How to Resume

1. Open a new Claude Code terminal in `C:\Users\whitl\wmax`
2. Say: **"Read HANDOFF.md and let's continue"**
3. Claude will orient immediately — no re-explaining needed

---

## Environment Notes

- **Platform:** Vercel (deployed, auto-deploys from main branch)
- **Dev command:** `npm run dev`
- **Branch:** main
- **Env vars needed:**
  - `ANTHROPIC_API_KEY` — must match the org with active credits
  - `SCREENSHOTONE_ACCESS_KEY` — no longer needed, safe to delete
- **GitHub:** https://github.com/Auto-Phil/ap-seo-and-ui-optimizer
- **Vercel project:** ap-seo-and-ui-optimizer
