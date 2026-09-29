# Grow Media

A bilingual (FR/EN) marketing site and future client platform for professional real-estate listing videos, made without a video shoot.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Geist. There are no runtime dependencies beyond these.

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /fr or /en
npm run build && npm start
npm run lint
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for canonical, hreflang and OpenGraph URLs.

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation, design system, i18n, navigation, homepage, responsive marketing site | ✅ Done |
| 2 | Supabase Auth, free-video onboarding, project creation, uploads, project status | ✅ Done |
| 3 | Dashboard, video library, Brand Kit, messages, revisions, subscriptions | ✅ Done (plan changes by email until Stripe) |
| 4 | Stripe, notifications, admin workflow, analytics provider, SEO polish | In progress: admin, email and Stripe built; activation needs keys |
| 5 | UX polish, mobile QA, accessibility, conversion optimization | — |

## Architecture

```
src/
  app/[locale]/            Routes. The root layout lives here so <html lang> is correct.
    page.tsx               Homepage (section order = the storytelling sequence)
    login/ signup/         Auth pages (UI ready; backend arrives in Phase 2)
    legal/[slug]/          Privacy / Terms / Cookies (localized slugs)
    opengraph-image.tsx    Per-locale OG image
  app/sitemap.ts, robots.ts
  proxy.ts                 Locale detection (cookie → Accept-Language → fr) and localized-URL rewrites
  i18n/
    config.ts              Locales, default locale, BCP-47 tags
    dictionaries/en.ts     Source of truth for every UI string (defines the type)
    dictionaries/fr.ts     French: typed against en, so a missing key fails the build
    routing.ts             Localized route map (/fr/connexion ↔ /en/login), href(), switchLocalePath()
    I18nProvider.tsx       useI18n() for client components
  config/
    site.ts                Brand name, contact, social links, feature flags
    pricing.ts             Plans, add-ons, launch offer (the only place prices live)
    services.ts            Service catalogue
    media.ts               Property imagery + example YouTube videos
    navigation.ts          Section anchor ids
  data/testimonials.ts     Real customer stories only (empty until real ones exist)
  lib/supabase/            Browser/server clients, session refresh (used by proxy.ts)
  lib/projects/            Domain types, client API (uploads, submit), server loaders
  components/app/          Client platform: nav, project cards, create wizard + upload manager
supabase/
  migrations/              Schema, RLS, storage buckets, database functions
  tests/                   Local RLS test suite (npm run test:db)
  lib/                     analytics (typed events), format (Intl currency), seo, cn
  components/
    ui/                    Button, Headline, SectionHeading, Eyebrow, Photo, PhoneMockup,
                           VideoPlayer, Modal, Accordion, StatusBadge, ProgressIndicator, …
    layout/                Navbar, Footer, Logo, LanguageSwitcher
    onboarding/            SignupProvider (one modal for every CTA), SignupFlow, FreeVideoButton,
                           auth-adapter (the Phase 2 swap point)
    marketing/             One component per homepage section, plus visuals/
```

### Adding a language
Add the code to `i18n/config.ts`, create `dictionaries/<code>.ts` typed as `Dictionary`, register it in `dictionaries/index.ts`, and add its slugs to `i18n/routing.ts`.

### Changing prices
Edit `config/pricing.ts`. Cards, the comparison block, the FAQ answer and JSON-LD all read from it.

### Example videos
Set the three YouTube IDs in `config/media.ts`. Set `aspect: "9:16"` for vertical Shorts. They appear in:
- the hero "Watch an Example" modal
- the Examples gallery
- the "Cinematic Video" tab of the content-engine section

They use a lightweight facade: YouTube loads only when someone presses play, through `youtube-nocookie.com`.

### Property photos
Placeholder Unsplash photos are listed in `config/media.ts`. Replace them with your own listings. Each image renders over a tonal fallback, so a slow or missing image never breaks the layout.

### Social proof policy
`data/testimonials.ts` starts empty, so the Results section shows an honest "be one of our first featured agents" invitation. Setting `NEXT_PUBLIC_SHOW_DEMO_SOCIAL_PROOF=true` renders layout-only demo cards, each with a visible "Demo content" badge; use this only in development. Metrics (views, likes, …) render only when a real value is present.

### Analytics
`lib/analytics.ts` exposes `track(event)` for the funnel events:
`hero_free_video_click`, `example_video_play`, `pricing_view`, `plan_selected`, `signup_started`, `signup_completed`, `project_started`, `photos_uploaded`, `project_submitted`, `free_video_completed`, `subscription_started`.

Events go to `window.dataLayer` (GTM-ready) and are re-emitted as a `gm:analytics` DOM event.

## Client platform (Phase 2)

### Connect Supabase
1. Create a Supabase project, preferably in `ca-central-1`.
2. Apply `supabase/migrations/*.sql`, either with `supabase db push` or by pasting the file into the SQL editor. This creates:
   - all tables, with Row Level Security
   - private storage buckets
   - the database functions for free credits and submission
   - starter content ideas
3. Put `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (and in your host's environment).
4. In Authentication → URL Configuration, add `https://your-domain/auth/callback` (and `http://localhost:3000/auth/callback`) to the redirect URLs.
5. Optional: turn off "Confirm email" so new agents land in their first project immediately. With it on, they confirm first and then continue.
6. Optional: enable Google under Providers and set `NEXT_PUBLIC_AUTH_GOOGLE=true`.
7. To give a team member staff access, run `update profiles set role = 'admin' where email = '…'`.

Without these variables the site still runs, and the client area shows an "accounts opening soon" screen.

### Flow
Homepage CTA → 3-step modal (details → password → photos) → account created → a draft project is created and the photos upload → the wizard continues at "Property details":

**type → details → upload → style → branding → notes → review → submit**

- Uploads use signed URLs with real progress bars, 2 at a time. Files can be reordered by drag or with the arrow buttons.
- Drafts save at every step and can be resumed from the dashboard.

### Security model
- Clients can only read and write their own rows and their own storage folder (`{user_id}/…`).
- Clients can only edit drafts. They can't change a status, a price or their credits.
- `submit_project()` decides the price on the server: free credit first, then the subscription allowance, otherwise payment is required. Paid checkout arrives in Phase 4.
- Staff (`role = 'admin'`) can see and update everything. Status changes automatically log timeline events and create notifications.

### Client area (Phase 3)
| Page | What it does |
| --- | --- |
| Dashboard | Greeting, free-video banner, plan usage (e.g. 2 / 4 videos), ready videos (watch, revision), current projects, content ideas |
| Projects / Project | Status timeline, video player and download, structured revision request, revision history, live message thread with attachments, post-delivery upsell for free videos |
| My Videos | Library of every non-draft project with its latest video; filters All / Ready / Processing / Revision |
| Ideas | Starter ideas per language; "Use This Idea" opens the wizard with the idea prefilled and linked |
| Messages | Latest message per project |
| Brand Kit | Name, agency, contact, logo, profile photo, colors, social handles, with a live preview of how branding appears on a video |
| Subscription | Current plan and usage, plans and add-ons. Changes go through email until Stripe (Phase 4) |
| Profile | Name, preferred language, password |
| Notifications | Bell with unread count and live updates (Supabase Realtime) |

### Database tests
`npm run test:db` runs 26 checks (isolation between users, locked submitted projects, free credit, subscription usage, delivery, revisions) against a throwaway local Postgres, using stubs for Supabase's auth and storage schemas.

## Production admin & email notifications (Phase 4)

- `/fr/admin` (or `/en/admin`) is only for staff (`profiles.role = 'admin'`). It has:
  - a queue by status (New, In production, Review, Revisions, Ready, Completed);
  - a project page with source-file downloads, status changes, final-video upload (to the client's private `deliverables` folder, with caption and hashtags), revision handling and the message thread as staff.
- **Emails** go through [Resend](https://resend.com). Database triggers create notifications, and `/api/email/dispatch` emails them to clients in their language. It runs every 5 minutes (`netlify/functions/dispatch-emails.mts`) and immediately after staff actions. New projects also alert `ADMIN_NOTIFY_EMAIL`.
- **Required Netlify env vars:** `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL`, `CRON_SECRET` (see `.env.example`).
- **Supabase auth emails** (confirmation, password reset) go through Resend too. Configure this in Supabase → Authentication → Emails → SMTP settings: host `smtp.resend.com`, port `465`, user `resend`, password = Resend API key.

## Payments (Stripe)

- **Plans:** the Subscription page opens Stripe Checkout for Agent and Pro. "Manage billing" opens the Stripe customer portal to change plan, update the card, get invoices or cancel.
- **Single videos:** when a client has no free credit and no plan allowance left, the wizard's last step becomes "Pay 49,95 $ and submit". The Stripe webhook submits the project once the payment is confirmed.
- **Add-ons (3D walkthrough, +99 $):** a walkthrough project costs its video (free credit, plan allowance or single price) plus the add-on. Subscribers pay in one click with the card on their plan (a one-off Stripe invoice, no redirect). Everyone else goes through Checkout. The database (`quote_for`, `finalize_paid_submission`) prices and submits the project; clients can never mark an add-on paid.
- **Server-side truth:** prices come from `src/config/pricing.ts` (or optional `STRIPE_PRICE_*` IDs). Subscription status and paid submissions are written only by the signature-verified webhook (`/api/stripe/webhook`), which is idempotent on the checkout session and subscription IDs.
- **Setup:**
  1. Stripe → Developers → API keys: add `STRIPE_SECRET_KEY` to Netlify.
  2. Webhooks → Add endpoint `https://<site>/api/stripe/webhook` with the events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated` and `customer.subscription.deleted`. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
  3. Settings → Billing → Customer portal: activate it (allow plan switching between Agent and Pro, and cancellation).
  4. `SUPABASE_SERVICE_ROLE_KEY` must be set; the webhook uses it.
- **Tests:** `npm run test:stripe` runs offline tests of signature verification and the webhook's database writes.
