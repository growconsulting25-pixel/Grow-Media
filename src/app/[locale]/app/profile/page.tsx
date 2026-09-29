import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/app/ProfileForm";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProfile } from "@/lib/projects/server";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function ProfilePage({ params }: PageProps<"/[locale]/app/profile">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const session = await getCurrentUser();
  if (!session) return null;
  const profile = await getProfile(session.supabase, session.user.id);
  return (
    <div>
      <h1 className="display text-3xl sm:text-4xl">{dict.app.profile.title}</h1>
      <div className="mt-8">
        <ProfileForm userId={session.user.id} email={session.user.email ?? ""} firstName={profile?.first_name ?? ""} lastName={profile?.last_name ?? ""} preferred={profile?.locale ?? locale} />
      </div>
    </div>
  );
}
