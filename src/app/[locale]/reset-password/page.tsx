import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { AuthShell } from "../AuthShell";
import { ResetForm } from "./ResetForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/reset-password">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "resetPassword", { title: dict.auth.resetTitle, description: dict.auth.resetSubtitle, noindex: true });
}

export default async function ResetPasswordPage({ params }: PageProps<"/[locale]/reset-password">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <AuthShell locale={locale} dict={dict}>
      <ResetForm />
    </AuthShell>
  );
}
