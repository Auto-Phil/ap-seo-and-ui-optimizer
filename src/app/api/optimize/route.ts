import { NextRequest, NextResponse } from "next/server";
import { streamOptimize } from "@/lib/optimizer";
import type { ScrapedPage } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let body: Partial<ScrapedPage>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { url, htmlContent, title, metaDescription, h1 } = body;

  if (!url || !htmlContent) {
    return NextResponse.json(
      { success: false, error: "url and htmlContent are required." },
      { status: 400 }
    );
  }

  try {
    const stream = streamOptimize({
      url,
      htmlContent,
      title: title ?? "",
      metaDescription: metaDescription ?? "",
      h1: h1 ?? "",
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Optimize error:", err);
    return NextResponse.json(
      { success: false, error: "AI optimization failed. Please try again." },
      { status: 500 }
    );
  }
}
