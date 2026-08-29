"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { dur, ease } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/work", key: "work" },
  { href: "/blog", key: "writing" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const { scrollY } = useScroll();

  // Flips a boolean at a threshold rather than setting state per frame.
  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 24;
    setCondensed((current) => (current === next ? current : next));
  });

  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname],
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // While the sheet is open: lock scroll, close on Escape, move focus in and
  // hand it back to the toggle on close.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      {/*
        Fixed, so the height transition is contained to the header's own
        containing block and never reflows the document beneath it.
      */}
      <header
        className={
          "fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color] duration-300 ease-out " +
          (condensed
            ? "h-[60px] border-b border-hairline bg-canvas/90 backdrop-blur-sm"
            : "h-[76px] border-b border-transparent bg-transparent")
        }
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8"
        >
          <Link href="/" className="group flex shrink-0 items-center gap-2.5 py-3">
            {/* Drafted monogram — the mark, generated rather than drawn. */}
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center border border-accent font-mono text-[0.72rem] leading-none text-accent transition-colors duration-200 group-hover:border-accent-2 group-hover:text-accent-2"
            >
              A
            </span>
            <span className="font-mono text-sm tracking-tight text-ink">
              akram
              <span
                className={
                  "text-ink-faint transition-opacity duration-300 " +
                  (condensed ? "opacity-0" : "opacity-100")
                }
              >
                {" "}
                bakhouche
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "relative px-3.5 py-2 font-mono text-[0.8rem] tracking-tight transition-colors duration-200 " +
                    (active ? "text-ink" : "text-ink-muted hover:text-ink")
                  }
                >
                  {t(`navigation.${link.key}`)}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-x-2.5 -bottom-0.5 h-[2px] bg-accent-2"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              ref={toggleRef}
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t("navigation.closeMenu") : t("navigation.openMenu")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[2px] border border-hairline text-ink transition-colors duration-200 hover:border-accent hover:text-accent md:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-canvas px-5 pb-8 pt-[92px] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : dur.base, ease: ease.standard }}
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduced ? 0 : dur.base,
                    ease: ease.out,
                    delay: reduced ? 0 : 0.04 + index * 0.05,
                  }}
                >
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={
                      "flex items-center justify-between border-b border-hairline py-4 font-display text-2xl tracking-tight transition-colors duration-200 " +
                      (isActive(link.href) ? "text-accent-2" : "text-ink hover:text-accent")
                    }
                  >
                    {t(`navigation.${link.key}`)}
                    <span aria-hidden="true" className="font-mono text-xs text-ink-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 sm:hidden">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for the fixed header. */}
      <div aria-hidden="true" className="h-[76px]" />
    </>
  );
}
