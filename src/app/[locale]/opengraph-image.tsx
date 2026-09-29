import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? locale : "fr");
  const [line1, line2] = dict.hero.headline;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f4f3f8",
          background: "#08101a",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600, display: "flex" }}>{siteConfig.name}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
          <span>{line1.text}</span>
          <span style={{ display: "flex" }}>
            {line2.text}
            <span style={{ color: "#00abff", marginLeft: 16 }}>{line2.accent}</span>
          </span>
        </div>
        <div style={{ fontSize: 26, color: "#a3a1b3", display: "flex" }}>{dict.common.trustLine.join("  ·  ")}</div>
      </div>
    ),
    size,
  );
}
