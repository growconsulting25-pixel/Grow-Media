import { notFound } from "next/navigation";
import { CreateWizard } from "@/components/app/create/CreateWizard";
import type { UploadedFile } from "@/components/app/create/UploadManager";
import { isLocale } from "@/i18n/config";
import { getProjectDetail } from "@/lib/projects/server";
import { isStripeConfigured } from "@/lib/stripe/server";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function CreatePage({ params, searchParams }: PageProps<"/[locale]/app/create">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const session = await getCurrentUser();
  if (!session) return null;

  // Resume a draft (from the signup modal, dashboard or a reload).
  const projectId = one(sp.project);
  let detail = null;
  if (projectId && /^[0-9a-f-]{36}$/i.test(projectId)) {
    const d = await getProjectDetail(session.supabase, projectId);
    if (d && d.project.status === "draft") detail = d;
  }

  const { data: plan } = await session.supabase.from("subscriptions").select("id").eq("status", "active").limit(1);

  return (
    <CreateWizard
      key={detail?.project.id ?? "new"}
      initialProject={detail?.project ?? null}
      initialFiles={(detail?.files ?? []) as UploadedFile[]}
      initialStep={one(sp.step) ?? (detail ? "upload" : undefined)}
      initialType={one(sp.type)}
      billingEnabled={isStripeConfigured()}
      hasSavedCard={Boolean(plan?.length)}
      initialNotes={one(sp.idea)}
      initialIdeaId={/^[0-9a-f-]{36}$/i.test(one(sp.ideaId) ?? "") ? one(sp.ideaId) : undefined}
    />
  );
}
