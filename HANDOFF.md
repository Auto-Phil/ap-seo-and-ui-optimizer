# Handoff — ap-seo-and-ui-optimizer

**Last updated:** 2026-03-24
**Status:** Deployed — pending confirmation that Anthropic API credits are resolving

---

## What This App Does

A free homepage audit tool (w.max) under Auto-Phil LLC. User pastes a URL → the app fetches the HTML → Claude rebuilds it as an optimized landing page → score reveal animation → full-width optimized page with callouts and lead capture form.

**Live URL:** Deployed on Vercel (ap-seo-and-ui-optimizer)
**GitHub:** https://github.com/Auto-Phil/ap-seo-and-ui-optimizer

---

## Current Status

The code is complete and architecturally sound. The last known issue was an Anthropic API credits error. A fresh API key was created and pushed to Vercel env vars, and a redeploy was triggered. Outcome unknown at time of handoff.

**If it's working:** great, move on to the known issues list below.
**If still failing:** go straight to the troubleshooting section.

---

## Architecture (Plain English)

```
User → / (home) → types URL → /analyze?url=...
  → POST /api/scrape   → plain fetch() + cheerio → returns title, H1, meta, cleaned HTML
  → POST /api/optimize → Anthropic claude-sonnet-4-6 streaming → returns optimized HTML + scores + callouts
  → RevealAnimation    → score count-up in browser
  → ComparisonView     → full-width iframe of AI page + callout cards + LeadCapture form
```

**Key technical decisions:**
- Scraper is a plain `fetch()` + cheerio — no browser, no screenshot API, sub-second
- Optimizer uses `messages.create({ stream: true })` — streams token-by-token to avoid Vercel's 60s function timeout
- Frontend reads the stream, accumulates text, parses JSON when stream closes
- No "before" screenshot — only the optimized output is shown
- Errors in the stream are encoded as `{ __error: "..." }` JSON so the function doesn't crash

---

## Environment Variables (Vercel)

| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | YES | Must match the org with active credits |
| `SCREENSHOTONE_ACCESS_KEY` | NO | Was used previously, now removed from code — safe to delete from Vercel |

---

## Troubleshooting Encyclopedia

Everything that went wrong this build, why, and how it was fixed. Do not re-investigate resolved issues.

---

### ❌ "credit balance is too low" (Anthropic 400 error)

**Symptom:** Vercel function log shows:
```
streamOptimize error: Error: 400 {"type":"error","error":{"type":"invalid_request_error",
"message":"Your credit balance is too low to access the Anthropic API."}}
```
**Root cause:** The Anthropic API key in Vercel either has no credits, or the credits were added to a different account/org than the one the key belongs to.

**Confirmed facts:**
- Zack's Anthropic org: "Zack's Individual Org" (org ID: `afd758e0-b7e4-4de8-be22-5c95f23447fb`)
- Only one org exists — no multi-org confusion
- $5 in credits was added
- A fresh API key was created and added to Vercel

**Fix checklist (do in order):**
1. Go to console.anthropic.com → Plans & Billing → confirm the balance shows a positive dollar amount (not $0.00)
2. Confirm the payment method isn't declined or pending
3. Go to console.anthropic.com → API Keys → confirm the key named in Vercel (`ANTHROPIC_API_KEY`) is Active, not Disabled/Deleted
4. In Vercel → Settings → Environment Variables → confirm `ANTHROPIC_API_KEY` value starts with `sk-ant-`
5. After any env var change, **manually redeploy** — Vercel does NOT auto-redeploy on env changes alone. Go to Deployments → ··· → Redeploy. OR push an empty commit: `git commit --allow-empty -m "trigger redeploy" && git push`
6. If still failing: create a brand new API key on console.anthropic.com, immediately paste it into Vercel, redeploy

**Do NOT:**
- Add credits to a workspace that doesn't own the API key
- Assume a Vercel redeploy happened — always verify in the Deployments tab

---

### ❌ FUNCTION_INVOCATION_FAILED (500, ~283ms execution)

**Symptom:** Vercel log shows `FUNCTION_INVOCATION_FAILED`, execution time is ~283ms, no external API calls in the log.

**Root cause:** The streaming ReadableStream was calling `controller.error(err)` which propagates an unhandled error and crashes the Vercel function instead of returning a graceful response.

**Fix applied (already in code):** `controller.error()` replaced with encoding the error as JSON data:
```typescript
controller.enqueue(encoder.encode(JSON.stringify({ __error: String(err) })));
controller.close();
```
The frontend checks for `data.__error` and shows a user-facing error message.

**If this error reappears:** Check `src/lib/optimizer.ts` — the catch block must NOT call `controller.error()`.

---

### ❌ Vercel Runtime Timeout (60s)

**Symptom:** `Vercel Runtime Timeout Error: Task timed out after 60 seconds`

**Root cause history:**
- First occurrence: Puppeteer launching Chromium on serverless (slow cold start)
- Second occurrence: ScreenshotOne full-page screenshot taking 30-60s
- Third occurrence: Claude Opus 4-6 generating 8000 tokens non-streaming

**Current fix:** Streaming. `messages.create({ stream: true })` sends tokens as they're generated. The function stays alive because data is flowing, not because computation finished. This is the correct permanent solution for LLM output on Vercel.

**If timeout returns:**
- Check `src/app/api/optimize/route.ts` — `export const maxDuration = 60` must be present
- Check `src/lib/optimizer.ts` — must use `stream: true`, not `messages.create()` without streaming
- Do NOT switch back to non-streaming — it will always hit the timeout on complex pages
- Do NOT switch back to Opus — Sonnet is fast enough and Opus will timeout

---

### ❌ Puppeteer / Chromium errors (RESOLVED — Puppeteer removed)

**These errors will NOT occur again** — Puppeteer, puppeteer-core, and @sparticuz/chromium have all been uninstalled. Do not reinstall them for any reason.

Errors that are now impossible:
- `The input directory "/var/task/node_modules/@sparticuz/chromium/bin" does not exist`
- `clip and fullPage are mutually exclusive`
- Chromium cold start timeouts

**If someone suggests reinstalling Puppeteer:** don't. The scraper is a plain `fetch()` call now. It's faster and more reliable.

---

### ❌ ScreenshotOne AbortError / timeout (RESOLVED — ScreenshotOne removed)

**These errors will NOT occur again** — ScreenshotOne was removed entirely. The scraper no longer takes screenshots at all. The `SCREENSHOTONE_ACCESS_KEY` env var in Vercel can be deleted.

---

### ❌ `clip` and `fullPage` are mutually exclusive (RESOLVED)

Puppeteer is gone. This cannot happen.

---

### ❌ "Before" screenshot panel is messy / iframe rendering broken

**Decision made:** The "before" screenshot panel was removed entirely. The app now shows only the AI-optimized output. This was both a product improvement and the fix for all screenshot-related issues.

Do not attempt to re-add a "before" panel without a solid plan for how to capture it — Puppeteer is gone, ScreenshotOne was too slow, and an iframe of the original site will be blocked by X-Frame-Options on most real sites.

---

### ⚠️ leads.json file storage will fail on Vercel (NOT YET FIXED)

**Symptom:** Lead capture form submissions may silently fail in production.

**Root cause:** Vercel serverless functions have a read-only filesystem. Writing to `data/leads.json` works locally but not in production.

**Fix needed:** Replace file storage with Vercel KV, Supabase, Airtable, or any persistent store. This has not been addressed yet.

---

## Known Issues To Fix Next Session

1. **Lead capture storage** — `data/leads.json` doesn't persist on Vercel. Switch to a real database (Vercel KV is simplest).
2. **End-to-end test** — Once credits are confirmed working, test on 3-4 real URLs and check output quality.
3. **iframe X-Frame-Options** — The optimized page iframe may be blocked on some browsers depending on CSP headers from the AI-generated HTML. Monitor in production.

---

## Files and What They Do

| File | Purpose |
|------|---------|
| `src/lib/scraper.ts` | Plain fetch + cheerio. Returns title, meta, H1, cleaned HTML. No browser. |
| `src/lib/optimizer.ts` | Streaming Claude call. Encodes errors as data, never calls controller.error(). |
| `src/lib/types.ts` | TypeScript interfaces: ScrapedPage, OptimizationResult, Callout |
| `src/lib/utils.ts` | URL validation and normalization |
| `src/app/api/scrape/route.ts` | POST endpoint. Rate limited 5/min per IP. maxDuration 15s. |
| `src/app/api/optimize/route.ts` | POST endpoint. Returns ReadableStream. maxDuration 60s. |
| `src/app/api/lead/route.ts` | POST endpoint. Saves to leads.json (broken on Vercel — see known issues). |
| `src/app/page.tsx` | Home page. URL input with validation and shake animation on error. |
| `src/app/analyze/page.tsx` | Orchestrates scrape → stream optimize → reveal → done phases. |
| `src/components/LoadingScreen.tsx` | Shows status messages + rotating "Did you know" facts every 5s. |
| `src/components/RevealAnimation.tsx` | Score count-up (before → after) then page reveal then callouts. |
| `src/components/ComparisonView.tsx` | Sticky top bar + full-width iframe + callout cards + lead capture. |
| `src/components/LeadCapture.tsx` | Name + email form. Submits to /api/lead. |
| `src/components/AnimatedNumber.tsx` | Eased number counter used in score reveal. |
| `src/app/globals.css` | CSS variables. Auto-Phil teal: `#2e8b7a`. Dark background: `#0a0d0c`. |
| `next.config.ts` | Empty — no special config needed since Puppeteer was removed. |

---

## How to Resume

1. Open a new Claude Code terminal in `C:\Users\whitl\wmax`
2. Say: **"Read HANDOFF.md and let's continue"**
3. Start with the troubleshooting section if anything is still broken

---

## Environment Notes

- **Platform:** Vercel (auto-deploys from GitHub main branch)
- **Dev command:** `npm run dev`
- **Local dev server note:** On Windows with npm path spaces, use `npm run dev` via Bash tool if preview tools fail
- **Branch:** main
- **Required env vars:** `ANTHROPIC_API_KEY` only
- **GitHub:** https://github.com/Auto-Phil/ap-seo-and-ui-optimizer
