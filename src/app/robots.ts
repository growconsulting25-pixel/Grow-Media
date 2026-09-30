import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const privatePaths = ["/api/", "/auth/", "/en/app/", "/fr/app/", "/en/admin/", "/fr/admin/"];

/**
 * Search engines and AI answer engines are welcome on the public pages
 * (being cited by ChatGPT, Perplexity, Claude or Gemini is the goal);
 * client and admin areas stay private.
 */
const aiCrawlers = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "Meta-ExternalAgent", "DuckAssistBot", "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      { userAgent: aiCrawlers, allow: "/", disallow: privatePaths },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
