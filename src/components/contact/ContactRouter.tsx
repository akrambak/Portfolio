"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { dist, drawVariants, dur, ease } from "@/lib/motion";
import { CornerBrackets } from "@/components/schematic/CornerBrackets";
import { FigureLabel } from "@/components/schematic/FigureLabel";
import { Rule } from "@/components/schematic/Rule";
import { ArrowRight } from "@/components/ui/CTALink";
import { ChoiceGroup } from "@/components/contact/ChoiceGroup";
import { RouteTiles } from "@/components/contact/RouteTiles";
import {
  TitleBlock,
  type LiveRow,
  type TitleBlockSocial,
} from "@/components/contact/TitleBlock";
import {
  DEFAULT_ROUTE,
  OPTIONS,
  ROUTE_FIELDS,
  ROUTE_REQUIRED,
  ROUTES,
  isMulti,
  type ChoiceField,
  type EnquiryRoute,
} from "@/lib/enquiry";

type Status = "idle" | "submitting" | "success" | "error";

/** Reused verbatim from the form this replaces — the drawn input dress. */
const FIELD =
  "w-full rounded-[2px] border border-hairline bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-faint transition-colors duration-200 hover:border-hairline-strong focus:border-accent focus:outline-none focus-visible:outline-none disabled:opacity-60";

const LABEL =
  "mb-2 block font-mono text-xs uppercase tracking-[0.14em] text-ink-muted";

const ERROR_NOTE = "mt-2 font-mono text-xs tracking-tight text-accent-2";

/**
 * The same loose pattern the route uses. Duplicated rather than imported because the route is
 * not client-safe, and deliberately loose for the same reason it is there: address syntax is
 * not worth policing beyond "could plausibly be delivered". This check exists so the
 * overwhelmingly common failure — a fat-fingered address — is caught here with the field
 * flagged, rather than coming back as a 400 the client cannot attribute to anything.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Choices = {
  projectType: string[];
  budget: string;
  timeline: string;
  engagement: string;
  heardVia: string;
};

const EMPTY_CHOICES: Choices = {
  projectType: [],
  budget: "",
  timeline: "",
  engagement: "",
  heardVia: "",
};

interface ContactRouterProps {
  siteName: string;
  email: string | null;
  location: string | null;
  socials: TitleBlockSocial[];
  calendly: string | null;
}

export function ContactRouter({
  siteName,
  email,
  location,
  socials,
  calendly,
}: ContactRouterProps) {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const [route, setRoute] = useState<EnquiryRoute>(DEFAULT_ROUTE);
  const [choices, setChoices] = useState<Choices>(EMPTY_CHOICES);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    // Honeypot — see the hidden field at the bottom of the form.
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = useState("");

  /**
   * Until React attaches, this is a plain <form> with no action — so a submit in that
   * window is a native GET to the current URL, putting the visitor's name, email and
   * message into the address bar, their history, the referrer and the server's access
   * log. The window is short, but the data is exactly the data that must not leak, and
   * the form cannot do anything useful before hydration anyway.
   */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const submitting = status === "submitting";
  const fields = ROUTE_FIELDS[route];

  /**
   * The API answers failures with a stable code, not a sentence: the wording is translated
   * here, and an SMTP error has no business reaching a visitor.
   */
  const messageForCode = (code: unknown) => {
    switch (code) {
      case "invalid":
        return t("contactSection.invalid");
      case "rate_limited":
        return t("contactSection.rateLimited");
      case "unavailable":
        return t("contactSection.unavailable");
      case "send_failed":
        return t("contactSection.sendFailed");
      default:
        return t("contactSection.error");
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    clearError(name);
  };

  const clearError = (key: string) => {
    setFieldErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const handleChoice = (field: ChoiceField, next: string | string[]) => {
    setChoices((previous) => ({ ...previous, [field]: next }));
    clearError(field);
  };

  const handleRoute = (next: EnquiryRoute) => {
    setRoute(next);
    setFieldErrors({});
    // Arrowing across routes silently rewrites a chunk of the DOM; without this the change is
    // inaudible. Focus is deliberately NOT moved — the radio holds it, and stealing it would
    // break the arrow walk mid-selection.
    setAnnouncement(t(`contactRoute.${next}.formTitle`));
  };

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const answered = (field: ChoiceField) =>
    isMulti(field)
      ? (choices[field] as string[]).length > 0
      : Boolean(choices[field]);

  const total = fields.length + 3;
  const done =
    fields.filter(answered).length +
    [formData.name, formData.email, formData.message].filter((value) =>
      value.trim(),
    ).length;

  const validate = () => {
    const errors: Record<string, string> = {};
    const required = t("contactSection.errorRequired");

    for (const field of ROUTE_REQUIRED[route]) {
      if (!answered(field)) errors[field] = required;
    }
    if (!formData.name.trim()) errors.name = required;
    if (!formData.email.trim()) errors.email = required;
    else if (!EMAIL.test(formData.email.trim()))
      errors.email = t("contactSection.errorEmail");
    if (!formData.message.trim()) errors.message = required;

    return errors;
  };

  /** DOM order, so focus lands on the first problem rather than an arbitrary one. */
  const focusFirstInvalid = (errors: Record<string, string>) => {
    for (const key of [...fields, "name", "email", "message"]) {
      if (!errors[key]) continue;
      formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
      return;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus("idle");
      setError(null);
      focusFirstInvalid(errors);
      return;
    }

    setStatus("submitting");
    setError(null);

    // Only the questions this route actually asked. Switching route mid-form leaves earlier
    // answers in state on purpose, so switching back does not lose them — but they must not
    // ride along into the mail for a route that never asked.
    const payload: Record<string, unknown> = { route, ...formData };
    for (const field of fields) payload[field] = choices[field];

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(messageForCode(errorData?.code));
      }

      setStatus("success");
    } catch (caught: unknown) {
      let message = t("contactSection.unexpectedError");
      if (caught instanceof Error) message = caught.message;
      else if (typeof caught === "string") message = caught;
      setError(message);
      setStatus("error");
    }
  };

  const reset = () => {
    setChoices(EMPTY_CHOICES);
    setFormData({ name: "", email: "", message: "", company: "" });
    setFieldErrors({});
    setError(null);
    setStatus("idle");
  };

  const routeLabels = ROUTES.reduce(
    (accumulator, key) => {
      accumulator[key] = {
        label: t(`contactRoute.${key}.label`),
        body: t(`contactRoute.${key}.body`),
      };
      return accumulator;
    },
    {} as Record<EnquiryRoute, { label: string; body: string }>,
  );

  const liveRows: LiveRow[] = fields.filter(answered).map((field) => ({
    key: field,
    label: t(`contactFields.${field}.legend`),
    value: isMulti(field)
      ? (choices[field] as string[])
          .map((value) => t(`contactFields.${field}.options.${value}`))
          .join(", ")
      : t(`contactFields.${field}.options.${choices[field] as string}`),
  }));

  const titleBlockProps = {
    heading: t("contactPage.titleBlock"),
    facts: [
      { key: "drawnBy", label: t("contactPage.drawnBy"), value: siteName },
      {
        key: "location",
        label: t("contactPage.locationLabel"),
        value: location,
      },
      {
        key: "response",
        label: t("contactPage.responseLabel"),
        value: t("contactPage.responseValue"),
      },
    ],
    email,
    directLabel: t("contactPage.directLabel"),
    socials,
    calendly,
    bookTitle: t("contactPage.bookTitle"),
    bookBody: t("contactPage.bookBody"),
    bookCta: t("contactPage.bookCta"),
  };

  return (
    <div>
      {/* ------------------------------------------------------------ band A: route */}
      {/*
        Hidden from AT: the caption repeats the fieldset's own legend word for word, and
        FIG. nn is a drafting annotation with nothing to say out loud. Sighted visitors
        see the question once; screen readers hear it once, from the legend.
      */}
      <div aria-hidden="true">
        <FigureLabel n={1}>{t("contactPage.routeLabel")}</FigureLabel>
      </div>
      <div className="mt-5">
        <RouteTiles
          value={route}
          onChange={handleRoute}
          legend={t("contactPage.routeLabel")}
          labels={routeLabels}
          disabled={submitting || status === "success"}
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <Rule className="my-10 sm:my-12" />

      {/* ------------------------------------------------------------- band B: sheet */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
        <div className="min-w-0">
          {/*
            A plain conditional, deliberately not an AnimatePresence swap.

            Under mode="wait" the incoming child is held until the outgoing one reports its
            exit animation complete — which makes the confirmation that an enquiry was
            delivered conditional on an animation finishing. Starve the frame loop and the
            visitor is left looking at a form frozen at "Sending..." for a message that did
            in fact send, and the obvious thing to do about that is send it again.

            This receipt is information, not decoration — the same reasoning globals.css
            gives for keeping the reading-progress bar alive under reduced motion. So it
            renders on state, and only its entrance is animated. The form gets no exit
            animation, which costs a fade nobody was looking at.
          */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : dist.item }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
              className="relative border border-hairline bg-surface p-6 sm:p-7"
            >
              <CornerBrackets active />

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="square"
                className="h-7 w-7 text-accent"
              >
                {/* The core gesture — a stroke drawing itself — spent once, where it lands. */}
                <motion.path
                  d="M3 12.5 L9.5 19 L21 5"
                  vectorEffect="non-scaling-stroke"
                  variants={drawVariants(reduced, 0.1)}
                  initial="hidden"
                  animate="visible"
                />
              </svg>

              <h2
                ref={successRef}
                tabIndex={-1}
                className="mt-5 font-display text-xl tracking-[-0.02em] text-ink focus-visible:outline-none"
              >
                {t("contactSection.successTitle")}
              </h2>
              <p className="mt-2.5 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
                {t("contactSection.successBody")}
              </p>

              <Rule className="my-6" />

              <button
                type="button"
                onClick={reset}
                className="inline-flex h-11 cursor-pointer items-center rounded-[2px] border border-hairline-strong px-5 font-mono text-xs tracking-tight text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                {t("contactSection.successAgain")}
              </button>
            </motion.div>
          ) : (
            <div>
              {/* Also hidden: the selected tile already announces this, and the live
                    region below announces it again on every change. Three would be noise. */}
              <div aria-hidden="true">
                <FigureLabel n={2}>
                  {t(`contactRoute.${route}.formTitle`)}
                </FigureLabel>
              </div>

              {/* Progress. aria-hidden on the drawing — the mono text beside it carries the
                    state, so there is no third region to clobber the other two. */}
              <div className="mt-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="relative h-2 w-full max-w-[10rem]"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline" />
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                    {/* scaleX, never width. The translate lives on the wrapper so it cannot
                          fight the transform framer writes onto this element. */}
                    <motion.span
                      className="block h-px w-full origin-left bg-accent"
                      animate={{ scaleX: done / total }}
                      transition={{
                        duration: reduced ? 0 : dur.base,
                        ease: ease.out,
                      }}
                    />
                  </span>
                  <span className="absolute left-0 top-0 h-2 w-px bg-hairline-strong" />
                  <span className="absolute right-0 top-0 h-2 w-px bg-hairline-strong" />
                </span>
                <span className="shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">
                  {t("contactPage.progress", { done, total })}
                </span>
              </div>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                aria-busy={submitting}
                className="mt-8 space-y-6"
              >
                {/*
                  The qualifier block. mode="wait" so the old questions are gone before the
                  new ones arrive and the height change happens while nothing is visible.
                  No `layout` prop anywhere; height itself is never animated.
                */}
                <AnimatePresence mode="wait" initial={false}>
                  {fields.length > 0 && (
                    <motion.div
                      key={route}
                      initial={{ opacity: 0, y: reduced ? 0 : dist.item }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduced ? 0 : -dist.micro }}
                      transition={{
                        duration: reduced ? 0 : dur.base,
                        ease: ease.out,
                      }}
                      className="space-y-7"
                    >
                      {fields.map((field) => (
                        <ChoiceGroup
                          key={field}
                          name={field}
                          legend={t(`contactFields.${field}.legend`)}
                          kind={isMulti(field) ? "multi" : "single"}
                          value={choices[field]}
                          onChange={(next) => handleChoice(field, next)}
                          optionalLabel={
                            ROUTE_REQUIRED[route].includes(field)
                              ? undefined
                              : t("contactPage.optional")
                          }
                          options={OPTIONS[field].map((value) => ({
                            value,
                            label: t(`contactFields.${field}.options.${value}`),
                          }))}
                          invalid={Boolean(fieldErrors[field])}
                          errorId={`${field}-error`}
                          error={fieldErrors[field]}
                          disabled={submitting}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={LABEL}>
                      {t("contactSection.name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={submitting}
                      aria-invalid={Boolean(fieldErrors.name) || undefined}
                      aria-describedby={
                        fieldErrors.name ? "name-error" : undefined
                      }
                      className={
                        FIELD + (fieldErrors.name ? " border-accent-2" : "")
                      }
                    />
                    {fieldErrors.name && (
                      <p id="name-error" role="alert" className={ERROR_NOTE}>
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={LABEL}>
                      {t("contactSection.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={submitting}
                      aria-invalid={Boolean(fieldErrors.email) || undefined}
                      aria-describedby={
                        fieldErrors.email ? "email-error" : undefined
                      }
                      className={
                        FIELD + (fieldErrors.email ? " border-accent-2" : "")
                      }
                    />
                    {fieldErrors.email && (
                      <p id="email-error" role="alert" className={ERROR_NOTE}>
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={LABEL}>
                    {t("contactSection.message")}
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={submitting}
                    aria-invalid={Boolean(fieldErrors.message) || undefined}
                    aria-describedby={
                      fieldErrors.message ? "message-error" : undefined
                    }
                    className={
                      FIELD +
                      " resize-y" +
                      (fieldErrors.message ? " border-accent-2" : "")
                    }
                  />
                  {fieldErrors.message && (
                    <p id="message-error" role="alert" className={ERROR_NOTE}>
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/*
                    Honeypot. `company` is the trap name — do NOT add a real organisation field
                    under it, or the API will discard every enquiry that fills it in. Positioned
                    off-screen rather than display:none, and kept out of the tab order and the
                    accessibility tree, so no real visitor can reach it.
                  */}
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                >
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

                {/* Never disabled for incompleteness — a disabled button is unfocusable and
                      explains nothing. Only while the request is in flight, or before
                      hydration — see the `hydrated` flag above. */}
                <button
                  type="submit"
                  disabled={submitting || !hydrated}
                  className={
                    "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] bg-accent-fill px-6 font-mono text-sm tracking-tight text-accent-on transition-colors duration-200 hover:bg-ink sm:w-auto" +
                    // Only the in-flight state is dressed as disabled. The pre-hydration
                    // window is a few frames and dimming the button through it would put a
                    // flash of dead-looking control on every page load.
                    (submitting ? " cursor-wait opacity-60" : "")
                  }
                >
                  {submitting
                    ? t("contactSection.sending")
                    : t("contactSection.send")}
                  {!submitting && <ArrowRight />}
                </button>

                {/* One live region for the submit outcome, as before. */}
                <div
                  aria-live="polite"
                  role="status"
                  className="min-h-[1.5rem]"
                >
                  {status === "error" && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, y: reduced ? 0 : dist.micro }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduced ? 0 : dur.base,
                        ease: ease.out,
                      }}
                      className="flex items-center gap-2 text-sm text-accent-2"
                    >
                      {error || t("contactSection.error")}
                    </motion.p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <TitleBlock {...titleBlockProps} live={liveRows} variant="full" />
        </div>
      </div>

      {/* The phone tail: facts only. A panel restating answers three inches up the screen is
          the same mistake the hero fix in this repo's history was about. */}
      <div className="mt-12 lg:hidden">
        <TitleBlock {...titleBlockProps} variant="static" />
      </div>
    </div>
  );
}
