import { NextRequest, NextResponse } from "next/server";
import { optimizePage } from "@/lib/optimizer";
import type { ScrapedPage } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: Partial<ScrapedPage>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { url, htmlContent, title, metaDescription, h1, screenshotBase64, brandColors } = body;

  if (!url || !htmlContent) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: url, htmlContent." },
      { status: 400 }
    );
  }

  const scraped: ScrapedPage = {
    url: url!,
    htmlContent: htmlContent!,
    title: title ?? "",
    metaDescription: metaDescription ?? "",
    h1: h1 ?? "",
    screenshotBase64: screenshotBase64 ?? "",
    brandColors: brandColors ?? [],
  };

  try {
    const data = await optimizePage(scraped);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[optimize]", err);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export const maxDuration = 60;
