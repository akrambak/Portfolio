import { NextResponse } from "next/server";

import { deleteLead, isLeadKey, upsertLead, type LeadReport } from "@/lib/leads";
import { verifyReadbackAuth } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A report is a bounded object; refuse anything larger before parsing it.
const MAX_BODY_BYTES = 32_000;

/**
 * POST /px/leads — Career-OS pushes a lead's report here before it sends the
 *   proposal that links to /r/<lead>, so the page never 404s on a live link.
 * DELETE /px/leads?lead=<key> — retire a report (unsubscribe, stale lead).
 *
 * Both are Bearer-gated (TRACKING_API_KEY); Career-OS is the only caller.
 */
export async function POST(request: Request) {
  if (!verifyReadbackAuth(request.headers.get("authorization"))) {
    return unauthorized();
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  let report: LeadReport;
  try {
    report = JSON.parse(text) as LeadReport;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!report || typeof report.lead !== "string" || !isLeadKey(report.lead)) {
    return NextResponse.json({ error: "invalid_lead" }, { status: 400 });
  }

  await upsertLead(report);
  return NextResponse.json({ ok: true, lead: report.lead });
}

export async function DELETE(request: Request) {
  if (!verifyReadbackAuth(request.headers.get("authorization"))) {
    return unauthorized();
  }
  const lead = new URL(request.url).searchParams.get("lead") ?? "";
  if (!isLeadKey(lead)) {
    return NextResponse.json({ error: "invalid_lead" }, { status: 400 });
  }
  await deleteLead(lead);
  return NextResponse.json({ ok: true });
}

function unauthorized() {
  return new NextResponse("unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": "Bearer", "Cache-Control": "no-store" },
  });
}
