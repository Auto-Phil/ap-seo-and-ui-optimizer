# Handoff — w.max / ap-seo-and-ui-optimizer

**Session date:** 2026-03-20
**Status:** Ready to Continue

---

## What We Were Building

A free homepage audit tool that scrapes any URL with Puppeteer, sends the HTML + screenshot to Claude, and renders a before/after comparison with scores and callouts. The "after" side was previously rendered as a sandboxed iframe (messy, fonts broken, resources blocked) — this session fixed that by using Puppeteer to render the AI-generated HTML to a screenshot instead.

---

## Where We Stopped

All code changes are complete and the build is clean (`npm run build` passed). The repo was just initialized and pushed to GitHub at https://github.com/Auto-Phil/ap-seo-and-ui-optimizer for the first time.

---

## What Is Done

- Created `src/lib/browser.ts` — shared `getBrowser()` util (dev: full puppeteer, prod: puppeteer-core + @sparticuz/chromium)
- Updated `src/lib/scraper.ts` — removed duplicate `getBrowser()`, now imports from `browser.ts`
- Updated `src/lib/optimizer.ts` — after Claude returns optimized HTML, renders it via `page.setContent()` + Puppeteer screenshot; attaches `optimizedScreenshotBase64` to result
- Updated `src/lib/types.ts` — added `optimizedScreenshotBase64: string` to `OptimizationResult`
- Updated `src/components/ComparisonView.tsx` — replaced `<iframe srcDoc>` with `<img>` using the new screenshot (both panels now consistent pixel-rendered images)
- Full build verified clean

---

## What Is NOT Done Yet

- No deployment configured yet (Vercel or otherwise) — env vars need to be set
- No `.env.local` committed (correct — should stay out of git)
- Lead capture (`/api/lead`) not reviewed this session — unknown status
- No custom domain set up

---

## Next Action (Start Here)

> Deploy to Vercel: run `vercel` from the project root, set `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard, and confirm the scrape + optimize flow works end-to-end in production.

---

## Key Decisions Made This Session

- Both before/after comparison panels now use Puppeteer screenshots (not iframe) for visual consistency
- `getBrowser()` extracted to a shared `src/lib/browser.ts` to avoid duplication between scraper and optimizer
- `page.setContent()` used for rendering optimized HTML (no network requests, fast ~3–5s)
- Puppeteer render happens server-side inside the `/api/optimize` route (no extra client round trip)

---

## Files Touched This Session

| File | What Changed |
|------|--------------|
| `src/lib/browser.ts` | Created — shared getBrowser() util |
| `src/lib/scraper.ts` | Removed inline getBrowser(), imports from browser.ts |
| `src/lib/optimizer.ts` | Added renderToScreenshot(), attached optimizedScreenshotBase64 to result |
| `src/lib/types.ts` | Added optimizedScreenshotBase64: string to OptimizationResult |
| `src/components/ComparisonView.tsx` | Replaced iframe with img tag using optimizedScreenshotBase64 |

---

## Known Issues / Watch Out For

- Vercel's max function duration is 60s for the optimize route — Claude + Puppeteer render runs sequentially, should stay under that but watch it on cold starts
- `@sparticuz/chromium` is required for Vercel production (included in dependencies); local dev uses full `puppeteer`
- The optimize route has `maxDuration = 60` set — don't lower it
- The scrape route has `maxDuration = 30` — screenshotting tall pages (clip at 3000px) should stay under that

---

## How to Resume

1. Open a new Claude Code terminal in `C:\Users\whitl\wmax`
2. Say: "Read HANDOFF.md and let's continue"
3. Claude will orient immediately — no re-explaining needed

---

## Environment Notes

- **Platform:** Vercel (target) — not yet deployed
- **Dev command:** `npm run dev`
- **Branch:** main (freshly initialized)
- **Env vars needed:** `ANTHROPIC_API_KEY` (not committed, must be set in Vercel dashboard)
- **GitHub:** https://github.com/Auto-Phil/ap-seo-and-ui-optimizer
