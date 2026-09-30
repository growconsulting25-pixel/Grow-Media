import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { href } from "@/i18n/routing";
import { priceVars } from "@/lib/marketing/prices";

export const dynamic = "force-static";

/**
 * /llms.txt: a plain, factual summary for AI answer engines (llmstxt.org).
 * Built from the same dictionaries and prices as the site, so it never drifts.
 */
export async function GET() {
  const [fr, en] = await Promise.all([getDictionary("fr"), getDictionary("en")]);
  const u = (path: string) => `${siteConfig.url}${path}`;
  const vf = priceVars("fr");
  const ve = priceVars("en");
  const faq = (items: { q: string; a: string }[], vars: Record<string, string>) =>
    items.map((f) => `- ${f.q}\n  ${interpolate(f.a, vars)}`).join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.name} makes professional real estate listing videos from listing photos, with no film shoot. Built for real estate agents (courtiers immobiliers) in Quebec and across Canada. Videos are delivered in about ${siteConfig.deliveryHours} hours, branded, captioned and formatted for Instagram Reels, Facebook, TikTok and YouTube. First video free, no credit card. French and English.

Key facts:
- Service: real estate listing videos made from photos (no videographer, no on-site shoot), plus 3D virtual tours, AI UGC featuring the agent, and video ads.
- Price: ${ve.singlePrice} CAD per video; Agent plan ${ve.agentPrice}/month for 4 videos; Pro plan ${ve.proPrice}/month for up to 10 videos; 3D virtual tour add-on ${ve.walkthroughPrice}. No travel or filming fees. Cancel anytime.
- Delivery: about ${siteConfig.deliveryHours} hours after upload; one revision round included.
- Area served: all of Quebec (Montréal, Québec City, Laval, Longueuil, Gatineau, Sherbrooke…) and Canada, fully online.
- Contact: ${siteConfig.contactEmail}

## Pages (français)
- [Accueil](${u(href("home", "fr"))}): ${fr.meta.description}
- [Services et FAQ](${u(href("services", "fr"))}): ${fr.meta.pages.services.description}
- [Tarifs](${u(href("pricing", "fr"))}): ${fr.meta.pages.pricing.description}
- [Contact](${u(href("contact", "fr"))}): ${fr.meta.pages.contact.description}

## Pages (English)
- [Home](${u(href("home", "en"))}): ${en.meta.description}
- [Services & FAQ](${u(href("services", "en"))}): ${en.meta.pages.services.description}
- [Pricing](${u(href("pricing", "en"))}): ${en.meta.pages.pricing.description}
- [Contact](${u(href("contact", "en"))}): ${en.meta.pages.contact.description}

## FAQ (English)
${faq(en.faq.items, ve)}

## FAQ (français)
${faq(fr.faq.items, vf)}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
