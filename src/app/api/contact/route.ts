import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Accept and drop it.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { name, email, subject, message } = body;
  const missing = [name, email, subject, message].some(
    (field) => typeof field !== "string" || field.trim().length === 0,
  );

  if (missing) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // TODO: wire an email provider (Resend, Postmark, SES) here. Until then the
  // submission is only visible in the server log.
  console.log("[contact]", { name, email, subject, message });

  return NextResponse.json({ ok: true }, { status: 200 });
}
