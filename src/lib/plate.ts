/**
 * Deterministic plan-view geometry for a work item's generated cover art.
 *
 * Everything here is derived from a hash of the slug — never Math.random(),
 * which would produce different geometry on the server and the client and
 * blow up as a hydration mismatch.
 */

const VIEW_W = 160;
const VIEW_H = 100;

export interface PlateModule {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlateLink {
  /** Orthogonal (L-shaped) path between two module edges. */
  d: string;
}

export interface PlateGeometry {
  viewBox: string;
  plateNo: string;
  modules: PlateModule[];
  links: PlateLink[];
}

/** FNV-1a. Small, stable, and dependency-free. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — a seeded PRNG, so the same slug always draws the same plate. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const snap = (value: number, step = 4) => Math.round(value / step) * step;

/**
 * Lays `count` modules across three columns, then links them in sequence with
 * orthogonal runs — a plan view, not a chart.
 */
export function plateGeometry(slug: string, count: number): PlateGeometry {
  const seed = hash(slug);
  const random = seeded(seed);
  const modules: PlateModule[] = [];

  const total = Math.max(3, Math.min(count, 6));
  const columns = 3;
  const colWidth = VIEW_W / columns;

  for (let i = 0; i < total; i += 1) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const w = snap(18 + random() * 20);
    const h = snap(12 + random() * 14);
    const x = snap(col * colWidth + 8 + random() * (colWidth - w - 16));
    const y = snap(14 + row * 40 + random() * 12);
    modules.push({ x, y, w, h });
  }

  const links: PlateLink[] = [];
  for (let i = 0; i < modules.length - 1; i += 1) {
    const a = modules[i];
    const b = modules[i + 1];
    const ax = a.x + a.w;
    const ay = a.y + a.h / 2;
    const bx = b.x;
    const by = b.y + b.h / 2;
    const midX = snap((ax + bx) / 2);
    // Orthogonal run: out, across, in.
    links.push({ d: `M${ax} ${ay} H${midX} V${by} H${bx}` });
  }

  const plateNo = String((seed % 89) + 10).padStart(2, "0");

  return {
    viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
    plateNo,
    modules,
    links,
  };
}
