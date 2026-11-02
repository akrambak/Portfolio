import { NextResponse } from "next/server";

import { readOpens, verifyReadbackAuth } from "@/lib/tracking";

// Reads a file; Node runtime, never cached. The dotted segment name serves this
// at /px/opens.json directly (same trick as src/app/rss.xml), so no rewrite.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /px/opens.json — the readback for Career-OS.
 *
 * Returns the first open per token as `[{ token, opened_at }]`, behind a Bearer
 * token (TRACKING_API_KEY). Without a configured key it always 401s, so an
 * unconfigured deploy never exposes the opens.
 */
export async function GET(request: Request) {
  if (!verifyReadbackAuth(request.headers.get("authorization"))) {
    return new NextResponse("unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Bearer", "Cache-Control": "no-store" },
    });
  }

  const opens = await readOpens();
  return NextResponse.json(opens, { headers: { "Cache-Control": "no-store" } });
}
