import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href, routes } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Logo } from "@/components/layout/Logo";

const docs = ["privacy", "terms", "cookies"] as const;
type Doc = (typeof docs)[number];

function docFromSlug(locale: Locale, slug: string): Doc | undefined {
  return docs.find((d) => routes[d][locale] === `/legal/${slug}`);
}

export function generateStaticParams() {
  return locales.flatMap((locale) => docs.map((d) => ({ locale, slug: routes[d][locale].replace("/legal/", "") })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/legal/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const doc = docFromSlug(locale, slug);
  if (!doc) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, doc, { title: dict.legal.title[doc], description: dict.legal.pending, noindex: true });
}

export default async function LegalPage({ params }: PageProps<"/[locale]/legal/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const doc = docFromSlug(locale, slug);
  if (!doc) notFound();
  const dict = await getDictionary(locale);
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
      <Logo href={href("home", locale)} />
      <h1 className="display mt-14 text-4xl sm:text-5xl">{dict.legal.title[doc]}</h1>
      <p className="mt-6 leading-relaxed text-fg-muted">{dict.legal.pending}</p>
      <Link href={href("home", locale)} className="mt-10 inline-block text-sm text-violet-300 hover:underline">← {dict.legal.back}</Link>
    </main>
  );
}
