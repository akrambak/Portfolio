"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { dur, ease } from "@/lib/motion";

/**
 * Light / night switch, drawn in the same 1.5-weight square-capped hand as the
 * rest of the chrome so it reads as part of the drawing rather than an icon
 * dropped in.
 *
 * Renders a same-size placeholder before mount. The resolved theme is unknown
 * on the server, so drawing either icon early would either shift the layout or
 * flash the wrong one.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-11 w-11" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to night theme"}
      className="relative flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-[2px] text-ink-muted transition-colors duration-200 hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: reduced ? 0 : -40, scale: reduced ? 1 : 0.75 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: reduced ? 0 : 40, scale: reduced ? 1 : 0.75 }}
          transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
          className="absolute flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            aria-hidden="true"
          >
            {isDark ? (
              <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8" />
              </>
            )}
          </svg>
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
