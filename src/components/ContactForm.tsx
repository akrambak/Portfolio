"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@/components/ui/CTALink";
import { dur, ease } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full rounded-[2px] border border-hairline bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-colors duration-200 hover:border-hairline-strong focus:border-accent focus:outline-none focus-visible:outline-none disabled:opacity-60";

const LABEL = "mb-2 block font-mono text-xs uppercase tracking-[0.14em] text-ink-muted";

export default function ContactForm() {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    // Honeypot — see the hidden field at the bottom of the form.
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  /**
   * The API answers failures with a stable code, not a sentence: the wording is
   * translated here, and an SMTP error has no business reaching a visitor.
   * Written as a switch rather than a lookup so the translation keys stay literal
   * and typo-checked.
   */
  const messageForCode = (code: unknown) => {
    switch (code) {
      case "invalid":
        return t("contactSection.invalid");
      case "rate_limited":
        return t("contactSection.rateLimited");
      case "unavailable":
        return t("contactSection.unavailable");
      default:
        return t("contactSection.error");
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(messageForCode(errorData?.code));
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", company: "" });
    } catch (caught: unknown) {
      let message = t("contactSection.unexpectedError");
      if (caught instanceof Error) message = caught.message;
      else if (typeof caught === "string") message = caught;
      setError(message);
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            {t("contactSection.name")}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            disabled={submitting}
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            {t("contactSection.email")}
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={submitting}
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={LABEL}>
          {t("contactSection.subject")}
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          disabled={submitting}
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          {t("contactSection.message")}
        </label>
        <textarea
          name="message"
          id="message"
          rows={6}
          required
          value={formData.message}
          onChange={handleChange}
          disabled={submitting}
          className={FIELD + " resize-y"}
        />
      </div>

      {/*
        Honeypot. Positioned off-screen rather than `display:none`, and kept out
        of the tab order and the accessibility tree, so no real visitor can reach
        it — a bot filling every input gives itself away, and the API discards
        that submission while still answering 200.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          name="company"
          id="company"
          tabIndex={-1}
          autoComplete="off"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] bg-accent-fill px-6 font-mono text-sm tracking-tight text-white transition-colors duration-200 hover:bg-accent-fill/88 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {submitting ? t("contactSection.sending") : t("contactSection.send")}
        {!submitting && <ArrowRight />}
      </button>

      {/* One live region for both outcomes, so a screen reader hears either. */}
      <div aria-live="polite" role="status" className="min-h-[1.5rem]">
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
            className="flex items-center gap-2 text-sm text-emerald-500"
          >
            {t("contactSection.success")}
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: reduced ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
            className="flex items-center gap-2 text-sm text-red-500"
          >
            {error || t("contactSection.error")}
          </motion.p>
        )}
      </div>
    </form>
  );
}
