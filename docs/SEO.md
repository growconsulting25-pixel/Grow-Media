# Grow Media: SEO, AEO and GEO architecture

Goal: rank on Google for Quebec real-estate video searches within 1–2 months, and be the answer AI engines (Google AI Overviews, ChatGPT, Perplexity, Claude, Copilot) cite when a broker asks about listing videos.

## 1. How people and engines search

| Engine | What it rewards | What we did |
|---|---|---|
| Google (classic) | One clear topic per URL, keyword in title/H1/URL/intro, internal links, speed, hreflang | 4 focused pages, strict titles and meta descriptions, 1 H1 per page, localized URLs, redirects |
| Google AI Overviews / AEO | Direct answers in the first sentence, question headings, FAQ markup | 16 Q&A written "answer first", `FAQPage` JSON-LD, answers kept in the HTML even when collapsed |
| ChatGPT, Perplexity, Claude (GEO) | Crawlable facts, consistent entity (name, price, area, contact), citable numbers | `Organization` + `WebSite` + `Service` + `Offer` JSON-LD with stable `@id`s, `/llms.txt`, AI crawlers allowed in `robots.txt` |

Our positioning versus competitors (local videographers who film on site: Studio Astraeus, CollabArt, Productions NRZ, Parsell): **no shoot, made from listing photos, delivered in 24 h, from 49,95 $**. Every page repeats these four facts in the same words, so engines learn them.

## 2. Keyword map

| Page | URL (FR / EN) | Primary keyword | Secondary |
|---|---|---|---|
| Home | `/fr` · `/en` | vidéo immobilière · real estate video | vidéo pour courtier immobilier, vidéo d'inscription, sans tournage, à partir de photos |
| Services + FAQ | `/fr/services` · `/en/services` | services vidéo courtier immobilier · real estate video services | visite virtuelle 3D, reel immobilier, UGC IA, publicité vidéo immobilière, photos en vidéo |
| Pricing | `/fr/tarifs` · `/en/pricing` | prix vidéo immobilière · real estate video pricing | combien coûte une vidéo immobilière, tarif vidéaste immobilier, forfait vidéo courtier |
| Contact | `/fr/contact` · `/en/contact` | vidéo immobilière Québec · contact | soumission publicité vidéo, forfait équipe |

Local modifiers to use in future articles and in Google Business Profile: Montréal, Québec, Laval, Longueuil / Rive-Sud, Gatineau, Sherbrooke, Trois-Rivières.

## 3. On-page (Yoast-level checklist)

| Page | Title (≤ 60 chars with " — Grow Media") | Meta description (120–156) | H1 |
|---|---|---|---|
| FR home | Vidéo immobilière pour courtiers, sans tournage — Grow Media (60) | 142 | Des vidéos immobilières professionnelles. Sans tournage. |
| FR services | Services vidéo pour courtiers immobiliers — Grow Media (54) | 145 | Services vidéo pour courtiers immobiliers. |
| FR tarifs | Prix d'une vidéo immobilière : nos tarifs — Grow Media (54) | 146 | Prix d'une vidéo immobilière. |
| FR contact | Contact : vidéo immobilière au Québec — Grow Media (50) | 145 | Parlons de vos inscriptions. |
| EN home | Real estate listing videos, no film shoot — Grow Media (54) | 138 | Professional real estate videos. Without the shoot. |
| EN services | Real estate video services for agents — Grow Media (50) | 149 | Video services for real estate agents. |
| EN pricing | Real estate video pricing — Grow Media (38) | 138 | Real estate video pricing. |
| EN contact | Contact us: real estate video — Grow Media (42) | 131 | Let's talk about your listings. |

- Exactly one H1 per page; sections use H2; cards and FAQ questions use H3.
- Keyword in the first sentence of each page intro.
- Canonical and `hreflang` (fr-CA, en-CA, x-default → FR) on every page. Open Graph and Twitter image on every page.
- Visible breadcrumb plus `BreadcrumbList` markup on inner pages.
- Internal links: nav (Services, Tarifs, Contact), home "Aller plus loin" cards, footer (Services, Tarifs, FAQ, Contact), FAQ → Contact, ads/add-on → Contact with the topic preselected.
- Legal, login and password pages are `noindex`. `/app` and `/admin` are disallowed.

**Permanent (308) redirects**

- `/fr/prix`, `/fr/tarif`, `/fr/forfaits`, `/fr/pricing` → `/fr/tarifs`
- `/en/tarifs`, `/en/prices` → `/en/pricing`
- `/fr/faq` → `/fr/services#faq`; `/en/faq` → `/en/services#faq`
- `/fr/nous-joindre` → `/fr/contact`
- `/tarifs`, `/pricing`, `/services`, `/contact`, `/faq` → the matching localized page

## 4. Structured data (JSON-LD)

| Where | Types |
|---|---|
| Every page | `Organization` (logo, email, contactPoint, areaServed Québec/Canada, knowsAbout, parent Grow Consulting) and `WebSite` |
| Home | `WebPage` and `Service` with 3 `Offer`s |
| Services | `CollectionPage`, 4 × `Service` (with `Offer` when priced), `FAQPage` (16 Q&A), `BreadcrumbList` |
| Pricing | `WebPage`, `Service` with `Offer`s (monthly plans use `UnitPriceSpecification` with P1M), `FAQPage` (5 Q&A), `BreadcrumbList` |
| Contact | `ContactPage` and `BreadcrumbList` |

No street address is published, because there is no public storefront. Add `LocalBusiness` only if a real address is listed on Google Business Profile.

Validate after deploy: https://search.google.com/test/rich-results and https://validator.schema.org

## 5. GEO / AEO checklist

- [x] Answer-first FAQ: the price, the delay and "no shoot" appear in the first sentence.
- [x] The same facts are worded identically everywhere (site, JSON-LD, `/llms.txt`).
- [x] `/llms.txt`: a plain-text summary with prices, pages and the full FAQ in both languages.
- [x] `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot and others.
- [x] FAQ answers stay in the HTML even when collapsed.
- [ ] Get cited on third-party sites (see section 6). AI engines trust sources other than the brand's own site.

## 6. Off-site plan (to do by you, weeks 1–8)

1. **Google Search Console**: add `media.growconsulting.ca`, submit `/sitemap.xml`, and request indexing for the 8 URLs.
2. **Bing Webmaster Tools**: import from Search Console. Bing feeds ChatGPT search and Copilot.
3. **Google Business Profile**: category "Service de production vidéo" or "Agence de marketing". Set the service area to Quebec, hide the address, add the site URL, and post 1 video per week.
4. **YouTube and Instagram**: publish every sample video with a keyword title ("Vidéo immobilière – Condo à Laval, réalisée à partir de photos"), linking to `/fr/services`. Put the real social URLs in `src/config/site.ts`; they are then added to `sameAs` automatically.
5. **Citations and backlinks**:
   - growconsulting.ca (a link to Media from the main site);
   - Pages Jaunes, Yelp, and the Chamber of Commerce;
   - Proprio Direct and Centris partner directories where possible;
   - the broker Facebook groups;
   - a guest article in a real-estate blog.
6. **Content, 1 article every 2 weeks** (to add later as `/fr/blogue`):
   - Combien coûte une vidéo immobilière au Québec en 2026?
   - Vidéo immobilière vs photos : ce qui fait vendre
   - 7 idées de reels pour courtiers immobiliers
   - Visite virtuelle 3D : quand en vaut-elle la peine?
   - Comment publier une inscription sur Instagram (guide courtier)
7. **Reviews**: ask each client for a Google review after delivery. Real testimonials also replace the placeholder "Résultats" section.

## 7. Measuring

- **Search Console:** impressions and clicks for "vidéo immobilière", "prix vidéo immobilière" and "vidéo courtier immobilier", checked weekly.
- **AI answers:** every month, ask ChatGPT, Perplexity and Google "Combien coûte une vidéo immobilière au Québec?" and "vidéo immobilière sans tournage". Note whether Grow Media is cited.
