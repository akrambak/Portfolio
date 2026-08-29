"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/config/site";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "mt-2 block w-full rounded-[3px] border border-rule bg-raised px-3 py-2.5 text-[0.9375rem] text-ink transition-colors duration-200 placeholder:text-faint hover:border-rule-strong focus:border-signal focus:outline-none focus-visible:outline-none disabled:opacity-60";

export default function ContactForm() {
  const t = useTranslations("form");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t("name")} disabled={busy} />
        <Field id="email" label={t("email")} type="email" disabled={busy} />
      </div>

      <Field
        id="subject"
        label={t("subject")}
        placeholder={t("subjectPlaceholder")}
        disabled={busy}
      />

      <div>
        <label htmlFor="message" className="font-mono text-eyebrow font-medium uppercase text-faint">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          disabled={busy}
          placeholder={t("messagePlaceholder")}
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Spam trap: real people never fill a field they cannot see. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[3px] bg-signal px-6 font-mono text-eyebrow font-medium uppercase text-on-signal transition-colors duration-200 hover:bg-signal-hover disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? `${t("sending")}…` : t("send")}
        </button>
      </div>

      <p aria-live="polite" className="min-h-6 text-sm">
        {status === "success" && (
          <span className="text-signal">{t("success", { email: site.email })}</span>
        )}
        {status === "error" && (
          <span className="text-ink">{t("error", { email: site.email })}</span>
        )}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  disabled,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-eyebrow font-medium uppercase text-faint">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={id === "email" ? "email" : id === "name" ? "name" : "off"}
        className={fieldClass}
      />
    </div>
  );
}
