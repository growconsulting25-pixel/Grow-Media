import { notFound } from "next/navigation";
import { BrandKitForm } from "@/components/app/BrandKitForm";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getBrandKit } from "@/lib/projects/server";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function BrandKitPage({ params }: PageProps<"/[locale]/app/brand-kit">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const session = await getCurrentUser();
  if (!session) return null;
  const { kit, logoUrl, photoUrl } = await getBrandKit(session.supabase, session.user.id);
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{dict.app.brand.title}</h1>
      <p className="mt-2 max-w-xl text-fg-muted">{dict.app.brand.subtitle}</p>
      <div className="mt-8">
        <BrandKitForm userId={session.user.id} kit={kit} logoUrl={logoUrl} photoUrl={photoUrl} />
      </div>
    </div>
  );
}
