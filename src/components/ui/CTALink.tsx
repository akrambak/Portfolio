import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "solid" | "ghost";

interface CTALinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}

const BASE =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-[2px] px-6 font-mono text-sm tracking-tight transition-colors duration-200";

const VARIANTS: Record<Variant, string> = {
  // Blueprint fill, white foreground: 10.1:1 — identical treatment everywhere.
  solid: "bg-accent-fill text-accent-on hover:bg-ink",
  ghost: "border border-hairline-strong text-ink hover:border-accent hover:text-accent",
};

/**
 * A drafted control: square corners, hairline or solid ink, colour-only
 * hover. The magnetic lean lives on a wrapper so the button never changes
 * size and nothing around it reflows.
 */
export function CTALink({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: CTALinkProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  const content = external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );

  return <Magnetic>{content}</Magnetic>;
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      className={"h-4 w-4 " + className}
    >
      <path d="M2 8h11M9.5 4.5L13 8l-3.5 3.5" />
    </svg>
  );
}
