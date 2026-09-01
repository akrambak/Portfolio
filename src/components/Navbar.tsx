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
import { ThemeToggle } from "./ThemeToggle";
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const { scrollY } = useScroll();

  // Flips a boolean at a threshold rather than setting state per frame.
  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 8;
    setScrolled((current) => (current === next ? current : next));
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
        Apple-style chrome: a thin bar of constant height that stays frosted at
        all times, with blur + saturation doing the work rather than opacity.
        Saturation is the half people forget — it is what makes colour bloom
        through the glass instead of going milky.

        Height never animates. Only background, border and shadow respond to
        scroll, so this is paint-only and cannot reflow the page. The blurred
        area is 48px tall, which is why this is cheap where a full-viewport
        blur was not.
      */}
      <header
        className={
          "fixed inset-x-0 top-0 z-50 h-12 border-b transition-[background-color,border-color] duration-300 ease-out " +
          "bg-canvas/95 supports-[backdrop-filter]:bg-canvas/65 " +
          "backdrop-blur-xl backdrop-saturate-[1.8] " +
          // Hairline only. A hardcoded drop shadow would be invisible on the
          // cyanotype ground, and the border already does the separating.
          (scrolled ? "border-hairline" : "border-transparent")
        }
      >
        <nav
          aria-label="Primary"
          className="mx-auto grid h-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8"
        >
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            {/* Drafted monogram — the mark, generated rather than drawn. */}
            <span
              aria-hidden="true"
              className="flex h-[22px] w-[22px] items-center justify-center border border-accent font-mono text-[0.62rem] leading-none text-accent transition-colors duration-200 group-hover:border-accent-2 group-hover:text-accent-2"
            >
              A
            </span>
            <span className="text-[0.8rem] font-medium tracking-tight text-ink">
              akram
              <span className="hidden text-ink-faint sm:inline"> bakhouche</span>
            </span>
          </Link>

          {/* Centre column: Apple puts the links dead centre, not beside the mark. */}
          <div className="hidden items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "relative py-2 text-[0.78rem] tracking-tight transition-colors duration-200 " +
                    (active ? "text-ink" : "text-ink-muted hover:text-ink")
                  }
                >
                  {t(`navigation.${link.key}`)}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-accent-2"
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

          <div className="flex items-center justify-end gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            <button
              ref={toggleRef}
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t("navigation.closeMenu") : t("navigation.openMenu")}
              className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-[2px] text-ink transition-colors duration-200 hover:text-accent md:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 9h16M4 15h16" />
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
            className="fixed inset-0 z-40 bg-canvas/95 px-5 pb-8 pt-[72px] backdrop-blur-xl backdrop-saturate-[1.8] md:hidden"
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
      <div aria-hidden="true" className="h-12" />
    </>
  );
}
