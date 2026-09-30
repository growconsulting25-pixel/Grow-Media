import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/admin/console/Cards";
import { ProfileForm } from "@/components/app/ProfileForm";
import { buttonClasses } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/interpolate";
import { requireAdmin } from "@/lib/admin/server";

/** Admin's own profile and password, where team alerts go, and the team. */
export default async function AdminSettingsPage({ params }: PageProps<"/[locale]/admin/settings">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.app.admin.console.settings;
  const { supabase, user } = await requireAdmin();
  const { data } = await supabase.from("profiles").select("first_name, last_name, locale").eq("id", user.id).single();
  const staffInbox = process.env.ADMIN_NOTIFY_EMAIL || siteConfig.contactEmail;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="display text-3xl sm:text-4xl">{t.title}</h1>
      <Panel title={t.profile} accent="slate">
        <ProfileForm userId={user.id} email={user.email ?? ""} firstName={data?.first_name ?? ""} lastName={data?.last_name ?? ""} preferred={(data?.locale as Locale) ?? locale} />
      </Panel>
      <Panel title={t.notifications} accent="rose">
        <p className="text-sm text-fg-muted">{interpolate(t.notificationsHint, { email: staffInbox })}</p>
      </Panel>
      <Panel title={t.team} accent="slate">
        <p className="text-sm text-fg-muted">{t.teamHint}</p>
        <Link href={`/${locale}/admin/team`} className={buttonClasses({ variant: "secondary", className: "mt-4" })}>{t.manageTeam}</Link>
      </Panel>
    </div>
  );
}
