import type { CSSProperties } from "react";
import ParallaxDriver from "./ParallaxDriver";
import { DialArcs, DimTrace, SignalTrace } from "./HeroArt";

type Plane = { y: number; x?: number; scale?: number };

/* One number per axis, shared by both drivers: `--depth*` feeds the CSS scroll
   timeline, `data-*` feeds the JS fallback. */
function plane({ y, x = 0, scale = 1 }: Plane) {
  return {
    style: {
      "--depth": `${y}vh`,
      "--depth-x": `${x}vw`,
      "--depth-scale": scale,
    } as CSSProperties,
    "data-depth": y,
    "data-depth-x": x,
    "data-scale": scale,
  };
}

/* Seven planes. The deep ones move a long way and zoom slightly; the near ones
   barely shift. The spread is what the eye reads as depth. */
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <ParallaxDriver />

      <div
        className="hero-wash parallax absolute -inset-y-[55%] inset-x-0"
        {...plane({ y: 62, scale: 1.18 })}
      />

      <div
        className="parallax absolute -inset-y-[38%] -inset-x-[10%]"
        {...plane({ y: 50, x: -4, scale: 1.12 })}
      >
        <DialArcs className="hero-arcs h-full w-full" />
      </div>

      <div
        className="hero-grid-coarse parallax absolute -inset-y-[45%] inset-x-0"
        {...plane({ y: 36, x: 3 })}
      />

      <div
        className="parallax absolute -inset-y-[30%] -inset-x-[8%]"
        {...plane({ y: 26, x: 6 })}
      >
        <DimTrace className="hero-trace-dim h-full w-full" />
      </div>

      <div
        className="parallax absolute -inset-y-[26%] -inset-x-[6%]"
        {...plane({ y: 17, x: -7 })}
      >
        <SignalTrace className="hero-trace h-full w-full" />
      </div>

      <div
        className="hero-grid-fine parallax absolute -inset-y-[45%] inset-x-0"
        {...plane({ y: 10, x: -3 })}
      />

      {/* Registration marks, framing the content column the way corner marks
          frame a plate on a technical drawing. */}
      <div className="parallax absolute inset-0" {...plane({ y: 5 })}>
        <div className="mx-auto h-full max-w-[70rem] px-5 sm:px-8">
          <div className="relative h-full">
            <span className="absolute left-0 top-[10%] h-6 w-6 border-l border-t border-hero-line-strong" />
            <span className="absolute right-0 top-[10%] h-6 w-6 border-r border-t border-hero-line-strong" />
            <span className="absolute bottom-[6%] left-0 h-6 w-6 border-b border-l border-hero-line-strong" />
            <span className="absolute bottom-[6%] right-0 h-6 w-6 border-b border-r border-hero-line-strong" />
          </div>
        </div>
        <div className="hero-ruler absolute inset-x-0 bottom-[4%] h-3.5" />
      </div>
    </div>
  );
}
