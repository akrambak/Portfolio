import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The navbar monogram, drawn at home-screen size. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbfaf7",
        }}
      >
        <div
          style={{
            width: 124,
            height: 124,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "5px solid #1b3a6b",
            color: "#1b3a6b",
            fontSize: 78,
            fontFamily: "monospace",
          }}
        >
          A
        </div>
      </div>
    ),
    size,
  );
}
