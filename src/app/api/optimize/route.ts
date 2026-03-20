import { NextRequest, NextResponse } from "next/server";
import { optimizePage } from "@/lib/optimizer";
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

  const { url, htmlContent, title, metaDescription, h1, screenshotBase64 } = body;

  if (!url || !htmlContent) {
    return NextResponse.json(
      { success: false, error: "url and htmlContent are required." },
      { status: 400 }
    );
  }

  try {
    const data = await optimizePage({
      url,
      htmlContent,
      title: title ?? "",
      metaDescription: metaDescription ?? "",
      h1: h1 ?? "",
      screenshotBase64: screenshotBase64 ?? "",
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Optimize error:", err);
    return NextResponse.json(
      { success: false, error: "AI optimization failed. Please try again." },
      { status: 500 }
    );
  }
}
