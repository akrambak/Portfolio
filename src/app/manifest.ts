import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — AI-augmented fullstack engineer`,
    short_name: "bak-dev",
    start_url: "/",
    display: "browser",
    background_color: "#fbfaf7",
    theme_color: "#0b1b2b",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
