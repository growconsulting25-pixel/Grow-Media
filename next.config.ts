import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /** Permanent redirects for likely URLs and old section anchors, so links never 404. */
  async redirects() {
    return [
      { source: "/fr/prix", destination: "/fr/tarifs", permanent: true },
      { source: "/fr/forfaits", destination: "/fr/tarifs", permanent: true },
      { source: "/fr/pricing", destination: "/fr/tarifs", permanent: true },
      { source: "/en/tarifs", destination: "/en/pricing", permanent: true },
      { source: "/en/prices", destination: "/en/pricing", permanent: true },
      { source: "/fr/faq", destination: "/fr/services#faq", permanent: true },
      { source: "/en/faq", destination: "/en/services#faq", permanent: true },
      { source: "/fr/nous-joindre", destination: "/fr/contact", permanent: true },
      { source: "/fr/tarif", destination: "/fr/tarifs", permanent: true },
      { source: "/tarifs", destination: "/fr/tarifs", permanent: true },
      { source: "/pricing", destination: "/en/pricing", permanent: true },
      { source: "/services", destination: "/fr/services", permanent: true },
      { source: "/contact", destination: "/fr/contact", permanent: true },
      { source: "/faq", destination: "/fr/services#faq", permanent: true },
    ];
  },
};

export default nextConfig;
