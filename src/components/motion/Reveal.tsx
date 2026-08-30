"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { VIEWPORT, dist, dur, ease, staggerParent } from "@/lib/motion";

type Tag = "div" | "section" | "article" | "header" | "li" | "ul" | "p" | "span";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Travel distance in px. Defaults to the 12px section value. */
  distance?: number;
  delay?: number;
  as?: Tag;
}

/** One element settling into place as it enters the viewport. */
export function Reveal({
  children,
  className,
  distance = dist.section,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduced ? 0 : dur.enter,
            ease: ease.out,
            delay: reduced ? 0 : delay,
          },
        },
      }}
    >
      {children}
    </Component>
  );
}

interface GroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: Tag;
}

/** Parent that walks its RevealItem children in one at a time. */
export function RevealGroup({ children, className, stagger, as = "div" }: GroupProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerParent(reduced, stagger)}
    >
      {children}
    </Component>
  );
}

interface ItemProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  as?: Tag;
}

export function RevealItem({
  children,
  className,
  distance = dist.item,
  as = "div",
}: ItemProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : dur.enter, ease: ease.out },
        },
      }}
    >
      {children}
    </Component>
  );
}
