"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { href } from "@/i18n/routing";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export function SignOutButton() {
  const { dict, locale } = useI18n();
  const router = useRouter();
  return (
    <button type="button" className="text-sm text-fg-muted hover:text-fg" onClick={async () => {
      await getSupabaseBrowser()?.auth.signOut();
      router.replace(href("login", locale));
      router.refresh();
    }}>
      {dict.auth.signOut}
    </button>
  );
}
