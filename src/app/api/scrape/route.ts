import { NextRequest, NextResponse } from "next/server";
import { scrapePage } from "@/lib/scraper";
import { isValidUrl, normalizeUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 15;

// Simple in-memory rate limiter: 5 req/min per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const rawUrl = body.url?.trim() ?? "";
  if (!rawUrl) {
    return NextResponse.json(
      { success: false, error: "URL is required." },
      { status: 400 }
    );
  }

  const url = normalizeUrl(rawUrl);
  if (!isValidUrl(url)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid URL (e.g. https://yoursite.com)" },
      { status: 400 }
    );
  }

  try {
    const data = await scrapePage(url);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Scrape error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error";

    if (message.includes("timeout") || message.includes("Timeout") || message.includes("aborted") || message.includes("AbortError")) {
      return NextResponse.json(
        { success: false, error: "That page took too long to load. Is it publicly accessible?" },
        { status: 504 }
      );
    }
    if (message.includes("status 4") || message.includes("status 5")) {
      return NextResponse.json(
        { success: false, error: "Could not load that URL. The page returned an error." },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Could not load that URL. Is it publicly accessible?" },
      { status: 500 }
    );
  }
}
