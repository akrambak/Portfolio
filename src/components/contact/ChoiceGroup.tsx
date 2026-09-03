"use client";

import { motion, useReducedMotion } from "framer-motion";
import { dur, ease } from "@/lib/motion";

/**
 * A chip group that is a real form control.
 *
 * The chips in WorkGrid, BlogClientPage and LanguageSwitcher are `<button aria-pressed>`
 * inside a `role="group"` — correct for a filter, wrong here. These are native radios and
 * checkboxes wearing the same visual, which buys arrow-key roving inside a radio group, one
 * tab stop per group, Space to toggle a checkbox, and "radio, 3 of 5, selected" announcements
 * without a line of keyboard JS. Reimplementing that with role="radio" and a hand-rolled
 * roving tabindex would be five chances to ship a keyboard trap.
 *
 * The input is a full-bleed transparent overlay rather than `opacity-0` or `sr-only`: an
 * `opacity-0` element cannot paint a focus ring, and a 1px `sr-only` control makes Chrome
 * anchor its validation bubble to a 1px box off in the corner. Full-size and transparent, the
 * ring and the bubble both land on the chip you can actually see.
 */

export interface ChoiceOption {
  value: string;
  label: string;
}

interface ChoiceGroupProps {
  /**
   * Unique per page. This is simultaneously the radio group name, the payload key and the
   * layoutId seed — reuse it on a second group and the pill will fly between two unrelated
   * questions.
   */
  name: string;
  legend: string;
  options: ChoiceOption[];
  kind: "single" | "multi";
  /** string for "single", string[] for "multi". */
  value: string | string[];
  onChange: (next: string | string[]) => void;
  /** Rendered inside the legend. Absent means the group is required. */
  optionalLabel?: string;
  invalid?: boolean;
  errorId?: string;
  error?: string;
  disabled?: boolean;
}

const LEGEND =
  "mb-3 block font-mono text-xs uppercase tracking-[0.14em] text-ink-muted";

/**
 * `has-[:focus-visible]` relays the ring from the invisible input to the visible chip. The
 * values mirror the global rule in globals.css (2px accent-2, offset 2, square) so a focused
 * chip looks like every other focused control on the site.
 */
const CHIP =
  "relative inline-flex h-11 cursor-pointer select-none items-center rounded-[2px] px-4 " +
  "font-mono text-xs tracking-tight transition-colors duration-200 " +
  "has-[:focus-visible]:rounded-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 " +
  "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-2 " +
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60";

const CHIP_ON = "text-accent-on";
const CHIP_OFF =
  "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink";

const INPUT =
  "peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-[2px] " +
  "border-0 bg-transparent disabled:cursor-not-allowed";

export function ChoiceGroup({
  name,
  legend,
  options,
  kind,
  value,
  onChange,
  optionalLabel,
  invalid = false,
  errorId,
  error,
  disabled = false,
}: ChoiceGroupProps) {
  const reduced = useReducedMotion();
  const selected = Array.isArray(value) ? value : [value];

  const toggle = (option: string) => {
    if (kind === "single") {
      onChange(option);
      return;
    }
    onChange(
      selected.includes(option)
        ? selected.filter((entry) => entry !== option)
        : [...selected, option],
    );
  };

  return (
    <fieldset className="m-0 border-0 p-0" disabled={disabled}>
      <legend className={LEGEND}>
        {legend}
        {/* The space is load-bearing: without a text node between them the accessible
            name of the group comes out as "BudgetOptional". */}
        {optionalLabel && (
          <>
            {" "}
            <span className="ml-2 text-ink-faint">{optionalLabel}</span>
          </>
        )}
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option.value);

          return (
            <label key={option.value} className={CHIP + " " + (checked ? CHIP_ON : CHIP_OFF)}>
              <input
                type={kind === "single" ? "radio" : "checkbox"}
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => toggle(option.value)}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid && errorId ? errorId : undefined}
                className={INPUT}
              />

              {checked &&
                (kind === "single" ? (
                  /* One pill per group, sliding between chips — WorkGrid's gesture verbatim. */
                  <motion.span
                    layoutId={`pill-${name}`}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-[2px] bg-accent-fill"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                ) : (
                  /*
                   * No layoutId on a multi-select: one pill cannot occupy four chips, and a
                   * shared id would tear it between them. Each fill arrives on its own.
                   */
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-[2px] bg-accent-fill"
                    initial={{ opacity: reduced ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0 : dur.micro, ease: ease.out }}
                  />
                ))}

              {option.label}
            </label>
          );
        })}
      </div>

      {invalid && error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2.5 font-mono text-xs tracking-tight text-accent-2"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
