/** Brand + site-wide settings. Swap the brand name here, never in components. */
export const siteConfig = {
  name: "Grow Media",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: "media@growconsulting.ca",
  /** Nominal delivery window in hours, used in copy and UI. */
  deliveryHours: 24,
  social: [
    { id: "instagram", href: "https://instagram.com/" },
    { id: "facebook", href: "https://facebook.com/" },
    { id: "tiktok", href: "https://tiktok.com/" },
    { id: "youtube", href: "https://youtube.com/" },
  ],
  /** Demo social proof is only ever rendered when explicitly enabled. */
  showDemoSocialProof: process.env.NEXT_PUBLIC_SHOW_DEMO_SOCIAL_PROOF === "true",
} as const;

export type SocialId = (typeof siteConfig.social)[number]["id"];
