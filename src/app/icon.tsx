import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Grow arrow favicon (PNG works in every browser, unlike SVG favicons). */
export default function Icon() {
  return new ImageResponse(
    (
      <svg width="64" height="64" viewBox="0 0 105 104">
        <path d="M5 5 100 43 58 60 41 99Z" fill="#00abff" stroke="#00abff" strokeWidth="9" strokeLinejoin="round" />
      </svg>
    ),
    size,
  );
}
