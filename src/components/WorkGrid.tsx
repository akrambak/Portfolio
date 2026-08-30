"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WORK, WORK_KINDS, type WorkKind } from "@/content/work";
import { WorkCard } from "@/components/WorkCard";
import { dur, ease } from "@/lib/motion";

type Filter = WorkKind | "all";

const FILTERS: Filter[] = ["all", ...WORK_KINDS];

export function WorkGrid() {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(
    () => (filter === "all" ? WORK : WORK.filter((item) => item.kind === filter)),
    [filter],
  );

  return (
    <div>
      <div
        role="group"
        aria-label={t("workPage.filterLabel")}
        className="mb-10 flex flex-wrap gap-2"
      >
        {FILTERS.map((value) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={active}
              className={
                "relative flex h-10 cursor-pointer items-center rounded-[2px] px-4 font-mono text-xs tracking-tight transition-colors duration-200 " +
                (active
                  ? "text-accent-on"
                  : "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink")
              }
            >
              {active && (
                <motion.span
                  layoutId="work-filter"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-[2px] bg-accent-fill"
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
              {t(`workPage.filters.${value}`)}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">{t("workPage.empty")}</p>
      ) : (
        <motion.ul layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.li
                key={item.slug}
                layout={!reduced}
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -4 }}
                transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
              >
                <WorkCard
                  item={item}
                  kindLabel={t(`workPage.filters.${item.kind}`)}
                  caseStudyLabel={t("workPage.caseStudy")}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
