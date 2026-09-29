import { ImageResponse } from "next/og";
import { markArrow, markRings, markViewBox } from "@/components/layout/Logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the Grow mark on white (iOS doesn't allow transparency). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="132" height="132" viewBox={markViewBox}>
          <g fill="none" stroke="#000000" strokeWidth="15" strokeLinecap="round">
            {markRings.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <path transform={markArrow.transform} d={markArrow.d} fill="#00abff" stroke="#00abff" strokeWidth="9" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
