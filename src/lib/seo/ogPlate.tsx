import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#fbfaf7";
const INK = "#14213d";
const BLUEPRINT = "#1b3a6b";
const REDLINE = "#b4451f";
const RULE = "#dcd8cc";
const FAINT = "#6b7280";

/**
 * A drafted title block.
 *
 * The grid is drawn as explicit 1px divs rather than a repeating gradient —
 * Satori's gradient support is narrower than a browser's, and 18 divs is
 * cheaper than debugging it.
 */
export interface PlateText {
  /** Small caps line top-left. */
  kicker: string;
  /** Headline, with an optional underlined middle part in blueprint blue. */
  before: string;
  emphasis?: string;
  after?: string;
  /** Bottom strip, left and right. */
  footer: string;
  figure: string;
  /** Long headlines (blog titles) drop the type size so three lines still fit. */
  compact?: boolean;
}

export function renderPlate({ kicker, before, emphasis, after, footer, figure, compact }: PlateText) {
  const verticals = Array.from({ length: 11 }, (_, i) => (i + 1) * 100);
  const horizontals = Array.from({ length: 5 }, (_, i) => (i + 1) * 105);
  const size = compact ? 54 : 70;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "64px",
          fontFamily: "monospace",
        }}
      >
        {verticals.map((x) => (
          <div
            key={`v${x}`}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 1,
              height: 630,
              background: RULE,
            }}
          />
        ))}
        {horizontals.map((y) => (
          <div
            key={`h${y}`}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              width: 1200,
              height: 1,
              background: RULE,
            }}
          />
        ))}

        {/* corner brackets */}
        {[
          { top: 40, left: 40, bw: "2px 0 0 2px" },
          { top: 40, right: 40, bw: "2px 2px 0 0" },
          { bottom: 40, left: 40, bw: "0 0 2px 2px" },
          { bottom: 40, right: 40, bw: "0 2px 2px 0" },
        ].map((corner, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              ...corner,
              width: 34,
              height: 34,
              borderColor: BLUEPRINT,
              borderStyle: "solid",
              borderWidth: corner.bw,
            }}
          />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 12, height: 12, background: REDLINE }} />
          <div style={{ color: FAINT, fontSize: 24, letterSpacing: 4 }}>
            {kicker.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ color: INK, fontSize: size, lineHeight: 1.08 }}>{before}</div>
          {emphasis && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ color: BLUEPRINT, fontSize: size, lineHeight: 1.08 }}>{emphasis}</div>
              <div style={{ width: 470, height: 3, background: REDLINE, marginTop: 4 }} />
            </div>
          )}
          {after && <div style={{ color: INK, fontSize: size, lineHeight: 1.08 }}>{after}</div>}
        </div>

        {/* title block strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${RULE}`,
            paddingTop: 20,
            color: FAINT,
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex" }}>{footer}</div>
          <div style={{ display: "flex", color: BLUEPRINT }}>{figure}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
