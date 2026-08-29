"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { dur, ease } from "@/lib/motion";

const KEYS = ["clientA", "clientB"] as const;
const INTERVAL = 6000;

export function Testimonials() {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Memoised on `t` alone. The previous version rebuilt this array on every
  // render, which tore down and re-armed the interval every render — so the
  // carousel could never actually reach its delay.
  const quotes = useMemo(
    () =>
      KEYS.map((key) => ({
        key,
        quote: t(`testimonials.${key}.quote`),
        author: t(`testimonials.${key}.author`),
      })),
    [t],
  );

  useEffect(() => {
    if (reduced || paused || quotes.length <= 1) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % quotes.length),
      INTERVAL,
    );
    return () => clearInterval(timer);
  }, [paused, quotes.length, reduced]);

  const current = quotes[index];
  const goTo = useCallback((next: number) => setIndex(next), []);

  return (
    <div
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative min-h-[13rem] sm:min-h-[11rem]">
        <AnimatePresence initial={false} mode="wait">
          <motion.figure
            key={current.key}
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
            className="border border-hairline bg-surface p-8 sm:p-10"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mb-5 h-6 w-6 text-accent-2"
              fill="currentColor"
            >
              <path d="M9.5 5C6.5 6.6 5 9.2 5 12.8V19h6.3v-6.4H8.1c0-2 .6-3.4 1.9-4.3L9.5 5zm9.3 0c-3 1.6-4.5 4.2-4.5 7.8V19H20.6v-6.4h-3.2c0-2 .6-3.4 1.9-4.3L18.8 5z" />
            </svg>
            <blockquote className="text-lg leading-relaxed text-ink sm:text-xl">
              {current.quote}
            </blockquote>
            <figcaption className="mt-5 font-mono text-sm text-ink-faint">
              — {current.author}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {quotes.length > 1 && (
        <div className="mt-6 flex justify-center gap-1">
          {quotes.map((quote, position) => (
            <button
              key={quote.key}
              type="button"
              onClick={() => goTo(position)}
              aria-label={`${t("testimonialSection.goToTestimonial")} ${position + 1}`}
              aria-current={position === index}
              className="flex h-11 w-11 cursor-pointer items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={
                  "h-1.5 transition-all duration-300 " +
                  (position === index ? "w-6 bg-accent-2" : "w-1.5 bg-hairline-strong")
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
