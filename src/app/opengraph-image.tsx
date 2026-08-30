import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — AI-augmented fullstack engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
export default async function OpenGraphImage() {
  const verticals = Array.from({ length: 11 }, (_, i) => (i + 1) * 100);
  const horizontals = Array.from({ length: 5 }, (_, i) => (i + 1) * 105);

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
            {site.name.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ color: INK, fontSize: 70, lineHeight: 1.08 }}>
            I design and ship
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: BLUEPRINT, fontSize: 70, lineHeight: 1.08 }}>
              AI-augmented
            </div>
            <div style={{ width: 470, height: 3, background: REDLINE, marginTop: 4 }} />
          </div>
          <div style={{ color: INK, fontSize: 70, lineHeight: 1.08 }}>
            fullstack products.
          </div>
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
          <div style={{ display: "flex" }}>Claude SDK · Laravel · Flutter · PrestaShop</div>
          <div style={{ display: "flex", color: BLUEPRINT }}>FIG. 01</div>
        </div>
      </div>
    ),
    size,
  );
}
