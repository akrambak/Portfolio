"use client";

import { useEffect } from "react";

/* CSS scroll timelines drive the hero on browsers that have them. This takes
   over only when they are absent (Firefox, older Safari) or when the timeline
   failed to attach — checked by asking the element what is animating it, not
   by feature-sniffing. Reduced motion is honoured either way. */
export default function ParallaxDriver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-depth]"),
    );
    if (layers.length === 0) return;

    const cssDriven = layers.every((el) =>
      el.getAnimations().some((a) => a.timeline && a.timeline !== document.timeline),
    );
    if (cssDriven) return;

    for (const el of layers) el.style.animation = "none";

    let frame = 0;
    const update = () => {
      frame = 0;
      const range = window.innerHeight * 1.15;
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      for (const el of layers) {
        const y = Number(el.dataset.depth) * progress;
        const x = Number(el.dataset.depthX ?? 0) * progress;
        const scale = 1 + (Number(el.dataset.scale ?? 1) - 1) * progress;
        el.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale})`;
      }
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
