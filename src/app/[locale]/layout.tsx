import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Darker_Grotesque, Hanken_Grotesk } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { SignupProvider } from "@/components/onboarding/SignupProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { isLocale, localeTags, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import { organizationLd } from "@/lib/schema";
import "../globals.css";

const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Darker_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-darker", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.title, template: `%s — ${siteConfig.name}` },
    description: dict.meta.description,
    applicationName: siteConfig.name,
  };
}

export const viewport: Viewport = {
  themeColor: "#16292D",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={localeTags[locale]} className={`${body.variable} ${display.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        {/* Enables reveal animations only when JS runs, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a href="#main" className="sr-only z-[100] rounded-full bg-white px-4 py-2 text-sm text-ink-900 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          {dict.common.skipToContent}
        </a>
        <I18nProvider locale={locale} dict={dict}>
          <SignupProvider>{children}</SignupProvider>
        </I18nProvider>
        <JsonLd data={organizationLd(dict, locale)} />
      </body>
    </html>
  );
}
