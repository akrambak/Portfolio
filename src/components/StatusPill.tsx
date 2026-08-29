import { site } from "@/config/site";

/**
 * Availability tag, drawn as a drafting label: square marker, hairline box,
 * mono caps. The marker ticks rather than pulses — a slow opacity blink with
 * no movement, and it stops entirely under reduced motion.
 */
export function StatusPill({ label }: { label: string }) {
  if (!site.availableForWork) return null;

  return (
    <span className="inline-flex items-center gap-2.5 border border-hairline bg-surface px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted">
      <span
        aria-hidden="true"
        className="animate-tick h-1.5 w-1.5 shrink-0 bg-accent-2 motion-reduce:animate-none"
      />
      {label}
    </span>
  );
}
