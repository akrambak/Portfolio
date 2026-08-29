"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations();

  const navLinks = [
    { href: "/about", label: t("navigation.about") },
    { href: "/modules", label: t("navigation.modules") },
    { href: "/themes", label: t("navigation.themes") },
    { href: "/portfolio", label: t("navigation.portfolio") },
    { href: "/blog", label: t("navigation.blog") },
    { href: "/contact", label: t("navigation.contact") },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/30 dark:bg-gray-900/40 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
              Akram Bakhouche
            </Link>
          </div>
          <div className="hidden items-center md:flex">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-white/50 hover:text-accent-600 dark:text-gray-200 dark:hover:bg-black/20 dark:hover:text-accent-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <LanguageSwitcher />
              <ThemeToggleButton />
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <LanguageSwitcher />
            <ThemeToggleButton />
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="ml-2 inline-flex items-center justify-center rounded-md bg-white/40 p-2 text-gray-700 hover:bg-white/60 hover:text-accent-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 dark:bg-black/20 dark:text-gray-300 dark:hover:bg-black/40 dark:hover:text-accent-400 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white/50 dark:bg-gray-800/60 backdrop-blur-sm`} id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-white/70 hover:text-accent-600 dark:text-gray-200 dark:hover:bg-black/30 dark:hover:text-accent-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 