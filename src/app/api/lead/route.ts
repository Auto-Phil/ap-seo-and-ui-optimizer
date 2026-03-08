import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface Lead {
  name: string;
  email: string;
  url: string;
  submittedAt: string;
}

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

async function appendLead(lead: Lead) {
  let leads: Lead[] = [];
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    leads = JSON.parse(raw);
  } catch {
    leads = [];
  }
  leads.push(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, email, url } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ success: false, error: "Valid email is required." }, { status: 400 });
  }
  if (!url || typeof url !== "string") {
    return NextResponse.json({ success: false, error: "URL is required." }, { status: 400 });
  }

  const lead: Lead = {
    name: name.trim(),
    email: email.trim(),
    url: url.trim(),
    submittedAt: new Date().toISOString(),
  };

  try {
    await appendLead(lead);
    console.log("[lead] New lead:", lead);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[lead] Failed to write lead:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save. Please try again." },
      { status: 500 }
    );
  }
}
