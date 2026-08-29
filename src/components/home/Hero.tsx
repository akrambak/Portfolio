"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/StatusPill";
import { AccentUnderline, TextReveal } from "@/components/motion/TextReveal";
import { PipelineSchematic } from "@/components/home/PipelineSchematic";
import { FigureLabel } from "@/components/schematic/FigureLabel";
import { ArrowRight, CTALink } from "@/components/ui/CTALink";
import { configured, site } from "@/config/site";
import { dur, ease } from "@/lib/motion";

const SIGNALS = ["Claude SDK", "Laravel", "Flutter", "PrestaShop", "TypeScript"];

export function Hero() {
  const t = useTranslations();
  const reduced = useReducedMotion();

  // Booking is the strongest intent, but only if a calendar actually exists.
  const primaryHref = configured(site.links.calendly) ? site.links.calendly : "/contact";

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : dur.enter,
      ease: ease.out,
      delay: reduced ? 0 : delay,
    },
  });

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div>
          <motion.div {...fade(0)}>
            <StatusPill label={t("hero.status")} />
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(2.25rem,6.4vw,4.25rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ink">
            <TextReveal
              delay={0.1}
              lines={[
                t("hero.lineA"),
                <span key="emphasis" className="relative inline-block text-accent">
                  {t("hero.emphasis")}
                  <AccentUnderline
                    className="absolute -bottom-[0.1em] left-0 h-[0.1em] w-full"
                    delay={0.75}
                  />
                </span>,
                t("hero.lineB"),
              ]}
            />
          </h1>

          <motion.p
            className="mt-8 max-w-[54ch] border-l border-hairline pl-5 text-lg leading-relaxed text-ink-muted"
            {...fade(0.45)}
          >
            {t("hero.lede")}
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...fade(0.55)}>
            <CTALink
              href={primaryHref as string}
              external={configured(site.links.calendly)}
            >
              {t("hero.ctaPrimary")}
              <ArrowRight />
            </CTALink>
            <CTALink href="/blog" variant="ghost">
              {t("hero.ctaSecondary")}
            </CTALink>
          </motion.div>

          <motion.ul
            className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-tight text-ink-faint"
            {...fade(0.7)}
          >
            {SIGNALS.map((signal, index) => (
              <li key={signal} className="flex items-center gap-4">
                {index > 0 && (
                  <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
                )}
                {signal}
              </li>
            ))}
          </motion.ul>
        </div>

        {/*
          The centrepiece: an annotated plan of a real pipeline.

          Deliberately second in source order. Placing it first on mobile
          pushed the headline to ~600px on an 812px screen — the diagram is
          the proof, but the claim has to land before the proof.
        */}
        <motion.figure
          className="border border-hairline bg-surface p-5"
          {...fade(0.3)}
        >
          <PipelineSchematic />
          <figcaption className="mt-3 border-t border-hairline pt-3">
            <FigureLabel n={1}>{t("figure.pipeline")}</FigureLabel>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
