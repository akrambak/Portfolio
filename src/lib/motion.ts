import type { Transition, Variants } from "framer-motion";

/**
 * The single source of truth for motion in this site.
 *
 * Rules this file exists to enforce:
 *  - transform + opacity only, never width/height/top/left
 *  - short distances (<= 12px) so reveals read as settling, not sliding
 *  - every factory takes `reduced` from `useReducedMotion()` and collapses to
 *    an opacity-only (or instant) variant when motion is not wanted
 */

type Cubic = [number, number, number, number];

export const dur = {
  micro: 0.15,
  base: 0.24,
  enter: 0.4,
  hero: 0.6,
} as const;

export const ease: { out: Cubic; standard: Cubic } = {
  out: [0.22, 1, 0.36, 1],
  standard: [0.4, 0, 0.2, 1],
};

export const dist = {
  micro: 4,
  item: 8,
  section: 12,
} as const;

export const STAGGER = 0.06;

/** Reveal once, a quarter of the way into view. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

export const springHover: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.6,
};

export const magneticSpring = {
  stiffness: 150,
  damping: 15,
  mass: 0.1,
} as const;

type Reduced = boolean | null;

export function revealVariants(reduced: Reduced, distance: number = dist.section): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : dur.enter, ease: ease.out },
    },
  };
}

export function staggerParent(reduced: Reduced, stagger: number = STAGGER): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : 0.04,
      },
    },
  };
}

/** Line-by-line mask reveal. Applied per line, never per character. */
export function lineVariants(reduced: Reduced): Variants {
  return {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : "0.6em",
      clipPath: reduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 -12% 0)",
      transition: { duration: reduced ? 0 : dur.hero, ease: ease.out },
    },
  };
}

/**
 * Blueprint's core gesture: a stroke drawing itself.
 *
 * `pathLength` is animated on the compositor like transform/opacity, so this
 * stays inside the transform-and-opacity-only rule.
 */
export function drawVariants(reduced: Reduced, delay = 0): Variants {
  return {
    hidden: { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: reduced ? 0 : 0.75, ease: ease.out, delay: reduced ? 0 : delay },
        opacity: { duration: reduced ? 0 : 0.12, delay: reduced ? 0 : delay },
      },
    },
  };
}

/** A dimension measuring itself out from its centre. */
export function measureVariants(reduced: Reduced, delay = 0): Variants {
  return {
    hidden: { scaleX: reduced ? 1 : 0, opacity: reduced ? 1 : 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: reduced ? 0 : dur.hero, ease: ease.out, delay: reduced ? 0 : delay },
    },
  };
}

/** Route transition: a settle, not a slide. */
export function pageVariants(reduced: Reduced): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : dist.micro },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : dur.base, ease: ease.out },
    },
  };
}
