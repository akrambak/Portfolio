import { NextResponse } from "next/server";

import { readEvents } from "@/lib/leads";
import { verifyReadbackAuth } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /px/events.json?since=<ISO> — the engagement readback for Career-OS.
 *
 * Returns every beacon event and raw open at `at >= since` (omit `since` for the
 * full log), behind the same Bearer token as /px/opens.json. The legacy opens-only
 * readback stays; this is the superset that also carries report views, clicks and
 * identified page views.
 */
export async function GET(request: Request) {
  if (!verifyReadbackAuth(request.headers.get("authorization"))) {
    return new NextResponse("unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Bearer", "Cache-Control": "no-store" },
    });
  }

  const since = new URL(request.url).searchParams.get("since") ?? undefined;
  const events = await readEvents(since);
  return NextResponse.json(events, { headers: { "Cache-Control": "no-store" } });
}
