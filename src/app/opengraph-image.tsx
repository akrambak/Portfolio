import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const t = await getTranslations("home");
  const tm = await getTranslations("meta");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#12161b",
          color: "#f2f3f5",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              border: "1px solid rgba(242,243,245,0.3)",
              borderRadius: 4,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {site.initials}
          </div>
          <div style={{ fontSize: 22, color: "#99a2ad" }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 940,
            }}
          >
            {t("headline")}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: "#99a2ad",
              maxWidth: 860,
              lineHeight: 1.4,
            }}
          >
            {tm("role")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            borderTop: "1px solid rgba(242,243,245,0.16)",
            paddingTop: 26,
            fontSize: 20,
            color: "#7ea0ff",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {site.email}
        </div>
      </div>
    ),
    size,
  );
}
