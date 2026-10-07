import { ImageResponse } from "next/og";
import { markArrow, markRings, markViewBox } from "@/components/layout/Logo";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the Grow mark with black rings (PNG works in every browser). */
export default function Icon() {
  return new ImageResponse(
    (
      <svg width="64" height="64" viewBox={markViewBox}>
        <g fill="none" stroke="#000000" strokeWidth="15" strokeLinecap="round">
          {markRings.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path transform={markArrow.transform} d={markArrow.d} fill="#F5A623" stroke="#F5A623" strokeWidth="9" strokeLinejoin="round" />
      </svg>
    ),
    size,
  );
}
