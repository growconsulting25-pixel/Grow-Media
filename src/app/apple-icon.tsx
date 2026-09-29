import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the Grow arrow on navy (iOS doesn't allow transparency). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#08101a" }}>
        <svg width="112" height="112" viewBox="0 0 105 104">
          <path d="M5 5 100 43 58 60 41 99Z" fill="#00abff" stroke="#00abff" strokeWidth="9" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
