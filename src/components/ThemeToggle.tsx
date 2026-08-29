"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "./icons";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("controls");

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[3px] border border-rule text-graphite transition-colors duration-200 hover:border-rule-strong hover:text-ink"
    >
      {/* Render neutral until mounted so the icon can't contradict the theme. */}
      {mounted && isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
