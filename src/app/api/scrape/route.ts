import { NextRequest, NextResponse } from "next/server";
import { scrapePage } from "@/lib/scraper";

// Simple in-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { url } = body;
  if (!url || typeof url !== "string" || !/^https?:\/\/.+\..+/.test(url)) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid URL." },
      { status: 400 }
    );
  }

  try {
    const data = await scrapePage(url);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    console.error("[scrape]", raw);
    const message = raw.includes("timeout")
      ? "That page took too long to load. Is it publicly accessible?"
      : `Scrape failed: ${raw.slice(0, 200)}`;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
