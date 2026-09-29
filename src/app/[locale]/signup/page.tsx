import { notFound } from "next/navigation";
import { SignupFlow } from "@/components/onboarding/SignupFlow";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../AuthShell";

export async function generateMetadata({ params }: PageProps<"/[locale]/signup">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "signup", { title: dict.signup.title, description: dict.signup.subtitle });
}

/** No-JS / direct-link fallback for the onboarding modal. */
export default async function SignupPage({ params }: PageProps<"/[locale]/signup">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <AuthShell locale={locale} dict={dict}>
      <div className="surface-raised rounded-[var(--radius-panel)]">
        <SignupFlow source="signup_page" />
      </div>
    </AuthShell>
  );
}
