#!/usr/bin/env node
/**
 * Assert every locale catalogue holds the same keys, with the same ICU placeholders.
 *
 * next-intl is configured with no fallback merge (src/i18n/request.ts imports one
 * catalogue and returns it), so a key present in en.json and missing from fr.json is
 * not a degraded label — it throws at request time, on a production page, for half the
 * visitors. `next build` cannot catch it because messages resolve per request, and
 * there is no test runner in this project.
 *
 * So this runs in `npm run lint`, which is what CI gates on.
 *
 * Deliberately dependency-free and node-only, in the same spirit as check-mail.mjs.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "messages");

/** Flatten to dotted paths, so a namespace that became a string is caught too. */
function flatten(value, prefix = "", into = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) flatten(child, full, into);
    else into.set(full, child);
  }
  return into;
}

/** The `{name}` arguments an ICU string expects. Order-independent. */
function placeholders(value) {
  if (typeof value !== "string") return "";
  return [...value.matchAll(/\{\s*([a-zA-Z0-9_]+)/g)].map((m) => m[1]).sort().join(",");
}

const files = fs.readdirSync(dir).filter((name) => name.endsWith(".json")).sort();
if (files.length < 2) {
  console.log(`check-messages: ${files.length} catalogue(s) in messages/ — nothing to compare.`);
  process.exit(0);
}

const catalogues = files.map((name) => {
  const full = path.join(dir, name);
  try {
    return { name, keys: flatten(JSON.parse(fs.readFileSync(full, "utf8"))) };
  } catch (error) {
    console.error(`check-messages: ${name} is not valid JSON — ${error.message}`);
    process.exit(1);
  }
});

// en.json is the reference: it is the defaultLocale in src/i18n/config.ts.
const reference = catalogues.find((c) => c.name === "en.json") ?? catalogues[0];
const problems = [];

for (const candidate of catalogues) {
  if (candidate === reference) continue;

  for (const key of reference.keys.keys()) {
    if (!candidate.keys.has(key)) problems.push(`${candidate.name}: missing "${key}"`);
  }
  for (const key of candidate.keys.keys()) {
    if (!reference.keys.has(key)) problems.push(`${candidate.name}: extra "${key}" (not in ${reference.name})`);
  }
  for (const [key, value] of candidate.keys) {
    if (!reference.keys.has(key)) continue;
    const expected = placeholders(reference.keys.get(key));
    const actual = placeholders(value);
    if (expected !== actual) {
      problems.push(
        `${candidate.name}: "${key}" takes {${actual || "none"}} but ${reference.name} takes {${expected || "none"}}`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error("check-messages: locale catalogues are out of step.\n");
  for (const problem of problems) console.error("  " + problem);
  console.error(`\n${problems.length} problem(s). A missing key throws at request time, not at build time.`);
  process.exit(1);
}

console.log(
  `check-messages: ${catalogues.length} catalogues, ${reference.keys.size} keys each, in step.`,
);
