"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/I18nProvider";
import type { BrandKit } from "@/lib/projects/server";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const SOCIALS = ["instagram", "facebook", "tiktok", "youtube", "linkedin"] as const;
const SOCIAL_LABELS: Record<(typeof SOCIALS)[number], string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube", linkedin: "LinkedIn" };

const input =
  "h-11 w-full rounded-xl bg-white/[0.04] px-3.5 text-[0.95rem] text-fg placeholder:text-fg-subtle shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_9%,transparent)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand-400)]";

type AssetKey = "logo_path" | "profile_photo_path";

export function BrandKitForm({ userId, kit, logoUrl, photoUrl }: { userId: string; kit: BrandKit | null; logoUrl?: string; photoUrl?: string }) {
  const { dict } = useI18n();
  const t = dict.app.brand;
  const [values, setValues] = useState({
    agent_name: kit?.agent_name ?? "",
    agency: kit?.agency ?? "",
    phone: kit?.phone ?? "",
    email: kit?.email ?? "",
    website: kit?.website ?? "",
    primary_color: kit?.primary_color ?? "#F5A623",
    secondary_color: kit?.secondary_color ?? "#f4f3f8",
  });
  const [social, setSocial] = useState<Record<string, string>>(kit?.social ?? {});
  const [assets, setAssets] = useState<Record<AssetKey, { path: string | null; url?: string }>>({
    logo_path: { path: kit?.logo_path ?? null, url: logoUrl },
    profile_photo_path: { path: kit?.profile_photo_path ?? null, url: photoUrl },
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error" | "upload_error">("idle");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setStatus("idle");
  };

  const upload = async (key: AssetKey, file: File | undefined) => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !file) return;
    if (!IMAGE_TYPES.includes(file.type) || file.size > 10 * 1024 * 1024) return setStatus("upload_error");
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
    const path = `${userId}/${key === "logo_path" ? "logo" : "photo"}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("brand").upload(path, file, { contentType: file.type, upsert: true });
    if (error) return setStatus("upload_error");
    setAssets((a) => ({ ...a, [key]: { path, url: URL.createObjectURL(file) } }));
    setStatus("idle");
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setStatus("saving");
    const clean = Object.fromEntries(Object.entries(social).filter(([, v]) => v.trim()));
    const { error } = await supabase
      .from("brand_kits")
      .upsert({
        user_id: userId,
        ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim() || null])),
        logo_path: assets.logo_path.path,
        profile_photo_path: assets.profile_photo_path.path,
        social: clean,
      });
    setStatus(error ? "error" : "saved");
  };

  const field = (k: keyof typeof values, label: string, type = "text", autoComplete?: string) => (
    <div>
      <label htmlFor={`bk-${k}`} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input id={`bk-${k}`} type={type} autoComplete={autoComplete} value={values[k]} onChange={set(k)} className={input} />
    </div>
  );

  return (
    <form onSubmit={save} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <Group title={t.identity}>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("agent_name", t.agentName, "text", "name")}
            {field("agency", t.agency, "text", "organization")}
          </div>
        </Group>
        <Group title={t.contact}>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("phone", t.phone, "tel", "tel")}
            {field("email", t.email, "email", "email")}
            <div className="sm:col-span-2">{field("website", t.website, "url", "url")}</div>
          </div>
        </Group>
        <Group title={t.visuals}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AssetPicker id="bk-logo" label={t.logo} asset={assets.logo_path} onPick={(f) => upload("logo_path", f)} onRemove={() => setAssets((a) => ({ ...a, logo_path: { path: null } }))} t={t} />
            <AssetPicker id="bk-photo" label={t.photo} round asset={assets.profile_photo_path} onPick={(f) => upload("profile_photo_path", f)} onRemove={() => setAssets((a) => ({ ...a, profile_photo_path: { path: null } }))} t={t} />
            {(["primary_color", "secondary_color"] as const).map((k) => (
              <div key={k}>
                <label htmlFor={`bk-${k}`} className="mb-1.5 block text-sm font-medium">{k === "primary_color" ? t.primaryColor : t.secondaryColor}</label>
                <div className="flex items-center gap-3">
                  <input id={`bk-${k}`} type="color" value={values[k]} onChange={set(k)} className="h-11 w-16 cursor-pointer rounded-lg bg-transparent" />
                  <span className="font-mono text-sm text-fg-muted">{values[k]}</span>
                </div>
              </div>
            ))}
          </div>
        </Group>
        <Group title={t.social}>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIALS.map((s) => (
              <div key={s}>
                <label htmlFor={`bk-social-${s}`} className="mb-1.5 block text-sm font-medium">{SOCIAL_LABELS[s]}</label>
                <input id={`bk-social-${s}`} value={social[s] ?? ""} placeholder="@" onChange={(e) => { setSocial((x) => ({ ...x, [s]: e.target.value })); setStatus("idle"); }} className={input} />
              </div>
            ))}
          </div>
        </Group>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={status === "saving"}>{status === "saving" ? t.saving : t.save}</Button>
          <p aria-live="polite" className={status === "saved" ? "text-sm text-success" : "text-sm text-red-300"}>
            {status === "saved" ? t.saved : status === "error" ? t.error : status === "upload_error" ? t.uploadError : ""}
          </p>
        </div>
      </div>

      {/* Live preview of how branding appears on a video */}
      <aside aria-label={t.preview} className="lg:sticky lg:top-10 lg:self-start">
        <p className="mb-2 text-sm text-fg-muted">{t.preview}</p>
        <div className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-ink-700 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-white)_8%,transparent)]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />
          {assets.logo_path.url && (
            // eslint-disable-next-line @next/next/no-img-element -- signed/local URL
            <img src={assets.logo_path.url} alt="" className="absolute top-5 right-5 h-8 max-w-24 object-contain" />
          )}
          <div className="absolute inset-x-4 bottom-4">
            <span className="inline-block rounded px-2 py-0.5 text-[0.65rem] font-bold tracking-wide uppercase" style={{ background: values.primary_color, color: values.secondary_color }}>
              {dict.content.formats.reel.overlay}
            </span>
            <div className="mt-3 flex items-center gap-2.5 border-t border-white/15 pt-3">
              {assets.profile_photo_path.url ? (
                // eslint-disable-next-line @next/next/no-img-element -- signed/local URL
                <img src={assets.profile_photo_path.url} alt="" className="size-9 rounded-full object-cover" />
              ) : (
                <span className="grid size-9 place-items-center rounded-full" style={{ background: values.primary_color }}><Icon name="user" className="size-4 text-[#fff]" /></span>
              )}
              <div className="min-w-0 text-xs leading-tight text-[#fff]">
                <p className="truncate font-semibold">{values.agent_name || t.agentName}</p>
                <p className="truncate text-[#fff]/70">{values.agency || t.agency}</p>
                {values.phone && <p className="truncate text-[#fff]/70">{values.phone}</p>}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="surface rounded-[var(--radius-panel)] p-6">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden className="mb-4 font-medium">{title}</p>
      {children}
    </fieldset>
  );
}

function AssetPicker({ id, label, asset, onPick, onRemove, round, t }: { id: string; label: string; asset: { path: string | null; url?: string }; onPick: (f: File | undefined) => void; onRemove: () => void; round?: boolean; t: { upload: string; replace: string; remove: string } }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <div className="flex items-center gap-3">
        <span className={`grid size-14 shrink-0 place-items-center overflow-hidden bg-white/[0.05] ${round ? "rounded-full" : "rounded-xl"}`}>
          {asset.url ? (
            // eslint-disable-next-line @next/next/no-img-element -- signed/local URL
            <img src={asset.url} alt="" className={round ? "size-full object-cover" : "size-full object-contain p-1"} />
          ) : (
            <Icon name="image" className="size-5 text-fg-subtle" />
          )}
        </span>
        <label htmlFor={id} className="cursor-pointer rounded-full bg-white/[0.06] px-3.5 py-2 text-sm hover:bg-white/10">{asset.path ? t.replace : t.upload}</label>
        <input id={id} type="file" accept={IMAGE_TYPES.join(",")} className="sr-only" onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = ""; }} />
        {asset.path && <button type="button" onClick={onRemove} className="text-xs text-fg-subtle hover:text-fg">{t.remove}</button>}
      </div>
    </div>
  );
}
