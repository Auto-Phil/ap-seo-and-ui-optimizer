import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

interface Lead {
  name: string;
  email: string;
  url: string;
  submittedAt: string;
}

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

async function readLeads(): Promise<Lead[]> {
  try {
    const content = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeLead(lead: Lead): Promise<void> {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  const leads = await readLeads();
  leads.push(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, email, url } = body;

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: "Valid email is required." }, { status: 400 });
  }
  if (!url) {
    return NextResponse.json({ success: false, error: "URL is required." }, { status: 400 });
  }

  const lead: Lead = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    url: url.trim(),
    submittedAt: new Date().toISOString(),
  };

  try {
    await writeLead(lead);
    console.log("New lead:", lead);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead write error:", err);
    return NextResponse.json({ success: false, error: "Could not save. Try again." }, { status: 500 });
  }
}
