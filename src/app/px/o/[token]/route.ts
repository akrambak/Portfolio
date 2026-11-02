import { recordOpen, TRACKING_GIF } from "@/lib/tracking";

// Appends to a file, so it needs the Node runtime — the edge runtime has no fs —
// and must run per request rather than being cached as a static asset.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /px/o/<token>.gif — the email open-tracking pixel.
 *
 * Always answers with the 1×1 GIF, even on a logging failure or an unrecognised
 * token: a broken image in the lead's inbox is a worse outcome than a missed
 * open, and recordOpen is written never to throw. The open is a side effect
 * (src/lib/tracking.ts); the response carries no information about it.
 *
 * `params` is a Promise in Next 15 and must be awaited.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  await recordOpen(token.replace(/\.gif$/, ""), {
    ua: request.headers.get("user-agent"),
    ip: request.headers.get("x-forwarded-for"),
  });

  return new Response(TRACKING_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": String(TRACKING_GIF.length),
      // Each open is its own request; no proxy or client may serve a cached hit,
      // or a second open from the same reader would go unrecorded.
      "Cache-Control": "no-store, private, max-age=0",
    },
  });
}
