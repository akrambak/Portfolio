"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  OPEN_CONSENT_EVENT,
  readConsent,
  saveConsent,
  type ConsentState,
} from "@/lib/consent";
import { dur, ease } from "@/lib/motion";

/**
 * Accept and Reject carry identical weight and sit side by side — the CNIL's line is
 * that refusing must be as easy as accepting, and a greyed-out "reject" or one hidden
 * behind "customise" is what it fines. Closing the banner without choosing is not
 * consent: nothing optional loads until a button is pressed.
 *
 * Non-modal on first visit (it must not trap a visitor who only came to read), but it
 * takes focus when reopened from the footer, since that is a deliberate request.
 */
const BUTTON =
  "inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[2px] border border-hairline-strong px-4 font-mono text-xs tracking-tight text-ink transition-colors duration-200 hover:border-accent hover:text-accent";

const CATEGORIES = ["analytics", "marketing"] as const;

export function ConsentBanner() {
  const t = useTranslations("consent");
  const reduced = useReducedMotion();
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [open, setOpen] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [draft, setDraft] = useState<ConsentState>({
    analytics: false,
    marketing: false,
  });
  const focusOnOpen = useRef(false);

  useEffect(() => {
    // Read after mount: the cookie is not visible to the server render of a static page.
    if (!readConsent()) setOpen(true);

    const reopen = () => {
      setDraft(readConsent() ?? { analytics: false, marketing: false });
      setCustomising(true);
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      headingRef.current?.focus();
    }
  }, [open]);

  const decide = (state: ConsentState) => {
    saveConsent(state);
    setOpen(false);
    setCustomising(false);
  };

  // Removed on state, not after an exit animation: under a starved frame loop an
  // AnimatePresence exit can hang, leaving a banner on screen after the choice was
  // made — the same reasoning as the contact form's receipt. Only the entrance moves.
  if (!open) return null;

  return (
    <motion.section
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
      className="fixed inset-x-4 bottom-4 z-[60] max-h-[calc(100vh-2rem)] overflow-y-auto border border-hairline-strong bg-surface p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[26rem] sm:p-6"
    >
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="font-mono text-xs uppercase tracking-[0.16em] text-ink focus-visible:outline-none"
      >
        {t("title")}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("body")}</p>

      {customising && (
        <fieldset className="mt-5 space-y-3 border-t border-hairline pt-4">
          <legend className="sr-only">{t("customise")}</legend>

          <div className="flex gap-3">
            <input
              type="checkbox"
              checked
              disabled
              aria-describedby={`${headingId}-necessary`}
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
              id={`${headingId}-necessary-input`}
            />
            <label htmlFor={`${headingId}-necessary-input`} className="text-sm">
              <span className="font-medium text-ink">
                {t("necessaryTitle")}
              </span>{" "}
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-faint">
                {t("alwaysOn")}
              </span>
              <span
                id={`${headingId}-necessary`}
                className="mt-0.5 block text-ink-muted"
              >
                {t("necessaryBody")}
              </span>
            </label>
          </div>

          {CATEGORIES.map((category) => (
            <div key={category} className="flex gap-3">
              <input
                type="checkbox"
                id={`${headingId}-${category}`}
                checked={draft[category]}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    [category]: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--accent)]"
              />
              <label
                htmlFor={`${headingId}-${category}`}
                className="cursor-pointer text-sm"
              >
                <span className="font-medium text-ink">
                  {t(`${category}Title`)}
                </span>
                <span className="mt-0.5 block text-ink-muted">
                  {t(`${category}Body`)}
                </span>
              </label>
            </div>
          ))}
        </fieldset>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          className={BUTTON}
          onClick={() => decide({ analytics: false, marketing: false })}
        >
          {t("reject")}
        </button>
        <button
          type="button"
          className={BUTTON}
          onClick={() => decide({ analytics: true, marketing: true })}
        >
          {t("accept")}
        </button>
      </div>

      <div className="mt-3">
        {customising ? (
          <button
            type="button"
            className={BUTTON + " w-full"}
            onClick={() => decide(draft)}
          >
            {t("save")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCustomising(true)}
            className="cursor-pointer font-mono text-xs text-ink-muted underline decoration-hairline-strong underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            {t("customise")}
          </button>
        )}
      </div>
    </motion.section>
  );
}

/** The footer's way back in. A GDPR requirement: withdrawing must be as easy as giving. */
export function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="flex min-h-11 cursor-pointer items-center font-mono text-xs text-ink-faint transition-colors duration-200 hover:text-ink"
    >
      {label}
    </button>
  );
}
