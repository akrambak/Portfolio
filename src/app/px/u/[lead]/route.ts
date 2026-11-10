import { NextResponse } from "next/server";

import { deleteLead, getLead, isLeadKey, recordEvent } from "@/lib/leads";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LID_COOKIE = "lid";

const COPY = {
  en: {
    title: "Unsubscribe",
    confirm: "Stop sending me these emails",
    prompt: "Click the button below and you will not receive another message from me about your store.",
    done: "Done — you have been unsubscribed. You will not hear from me again about your store.",
    already: "You are already unsubscribed. Nothing more will be sent.",
  },
  fr: {
    title: "Désinscription",
    confirm: "Ne plus recevoir ces e-mails",
    prompt: "Cliquez sur le bouton ci-dessous et vous ne recevrez plus aucun message de ma part au sujet de votre boutique.",
    done: "C'est fait — vous êtes désinscrit. Vous ne serez plus recontacté au sujet de votre boutique.",
    already: "Vous êtes déjà désinscrit. Plus aucun message ne sera envoyé.",
  },
} as const;

/**
 * GET /px/u/<lead> — the in-body unsubscribe link. Shows a one-button confirmation
 * rather than unsubscribing on load, because mail scanners GET every link and would
 * otherwise opt people out without their knowledge.
 *
 * POST /px/u/<lead> — RFC 8058 one-click (the List-Unsubscribe-Post path) and the
 * confirmation form. Records the opt-out, deletes the lead's report so nothing more
 * links to it, and clears the identity cookie.
 */
export async function GET(request: Request, ctx: { params: Promise<{ lead: string }> }) {
  const { lead } = await ctx.params;
  if (!isLeadKey(lead)) return notFound();
  const report = await getLead(lead);
  const lang = report?.language === "fr" ? "fr" : "en";
  const t = COPY[lang];

  if (!report) return page(lang, t.title, `<p>${t.already}</p>`);

  return page(
    lang,
    t.title,
    `<form method="post"><button type="submit">${t.confirm}</button></form>
     <p class="muted">${t.prompt}</p>`,
  );
}

export async function POST(request: Request, ctx: { params: Promise<{ lead: string }> }) {
  const { lead } = await ctx.params;
  if (!isLeadKey(lead)) return notFound();

  const report = await getLead(lead);
  const lang = report?.language === "fr" ? "fr" : "en";

  await recordEvent({ type: "unsubscribe", lead, at: new Date().toISOString() });
  await deleteLead(lead);

  // One-click (RFC 8058): the mail client POSTs `List-Unsubscribe=One-Click` and wants
  // a bare 200, not a page.
  const body = await request.text().catch(() => "");
  const res =
    body.includes("One-Click")
      ? new NextResponse("unsubscribed", { status: 200 })
      : page(lang, COPY[lang].title, `<p>${COPY[lang].done}</p>`);
  res.headers.set("Set-Cookie", `${LID_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`);
  return res;
}

function notFound() {
  return new NextResponse("not found", { status: 404, headers: { "Cache-Control": "no-store" } });
}

function page(lang: string, title: string, inner: string) {
  const html = `<!doctype html>
<html lang="${lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${title} — ${site.name}</title>
<style>
  :root{color-scheme:light dark}
  body{font:16px/1.6 system-ui,sans-serif;max-width:34rem;margin:12vh auto;padding:0 1.25rem;color:#1a1a1a;background:#fbfaf7}
  @media(prefers-color-scheme:dark){body{color:#e8e8e8;background:#0b1b2b}}
  h1{font-size:1.4rem;margin:0 0 1rem}
  button{font:inherit;padding:.7rem 1.2rem;border:1px solid currentColor;border-radius:4px;background:transparent;color:inherit;cursor:pointer}
  button:hover{opacity:.8}
  .muted{opacity:.7;font-size:.9rem;margin-top:1rem}
</style></head>
<body><h1>${title}</h1>${inner}</body></html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
