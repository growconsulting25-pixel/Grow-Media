import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../AuthShell";
import { ForgotForm } from "./ForgotForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/forgot-password">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "forgotPassword", { title: dict.auth.forgotTitle, description: dict.auth.forgotSubtitle, noindex: true });
}

export default async function ForgotPasswordPage({ params }: PageProps<"/[locale]/forgot-password">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <AuthShell locale={locale} dict={dict}>
      <ForgotForm />
    </AuthShell>
  );
}
