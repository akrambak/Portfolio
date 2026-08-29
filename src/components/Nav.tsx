"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CloseIcon, MenuIcon } from "./icons";
import { Container } from "./ui";
import LocaleToggle from "./LocaleToggle";
import ThemeToggle from "./ThemeToggle";
import { site } from "@/config/site";

const routes = [
  { href: "/work", key: "work" },
  { href: "/blog", key: "writing" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label={site.name}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-rule-strong font-mono text-[0.6875rem] font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:border-signal group-hover:text-signal">
              {site.initials}
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
              {site.name}
            </span>
          </Link>

          <nav aria-label={t("primary")} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    aria-current={isActive(route.href) ? "page" : undefined}
                    className={`relative flex h-16 items-center px-3 font-mono text-eyebrow font-medium uppercase transition-colors duration-200 ${
                      isActive(route.href)
                        ? "text-ink"
                        : "text-faint hover:text-ink"
                    }`}
                  >
                    {t(route.key)}
                    {isActive(route.href) && (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 bottom-0 h-px bg-signal"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LocaleToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={t("menu")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[3px] border border-rule text-graphite transition-colors duration-200 hover:text-ink md:hidden"
            >
              {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={t("primary")}
          className="border-t border-rule bg-paper md:hidden"
        >
          <Container>
            <ul className="py-2">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    aria-current={isActive(route.href) ? "page" : undefined}
                    className={`flex min-h-12 items-center border-b border-rule font-mono text-eyebrow font-medium uppercase last:border-b-0 ${
                      isActive(route.href) ? "text-signal" : "text-graphite"
                    }`}
                  >
                    {t(route.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
