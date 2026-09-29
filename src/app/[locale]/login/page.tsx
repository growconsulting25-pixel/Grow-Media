import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../AuthShell";
import { LoginForm } from "./LoginForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "login", { title: dict.auth.loginTitle, description: dict.auth.loginSubtitle, noindex: true });
}

export default async function LoginPage({ params, searchParams }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const dict = await getDictionary(locale);
  return (
    <AuthShell locale={locale} dict={dict}>
      <LoginForm next={typeof sp.next === "string" ? sp.next : undefined} initialError={typeof sp.error === "string" ? sp.error : undefined} />
    </AuthShell>
  );
}
