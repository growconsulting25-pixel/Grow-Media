"use client";

import { createDraft, uploadProjectFile } from "@/lib/projects/client-api";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { authConfig } from "@/lib/supabase/env";

/**
 * Auth boundary used by the onboarding UI. Backed by Supabase Auth; when
 * Supabase isn't configured it reports `not_configured` instead of faking it.
 */
export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  files: File[];
  source: string;
  locale: string;
}

export type SignupResult =
  | { ok: true; next: "app"; redirect: string; uploadFailed: boolean }
  | { ok: true; next: "confirm" }
  | { ok: false; reason: "not_configured" | "exists" | "weak" | "error" };

export async function signUp(input: SignupInput, onUpload?: (current: number, total: number) => void): Promise<SignupResult> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { ok: false, reason: "not_configured" };

  const createPath = `/${input.locale}/app/create`;
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { first_name: input.firstName, last_name: input.lastName, locale: input.locale, source: input.source },
      emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(createPath)}`,
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("registered") || msg.includes("exists")) return { ok: false, reason: "exists" };
    if (msg.includes("password")) return { ok: false, reason: "weak" };
    return { ok: false, reason: "error" };
  }
  // Supabase returns a user with no identities when the email is already taken.
  if (data.user && data.user.identities?.length === 0) return { ok: false, reason: "exists" };
  if (!data.session || !data.user) return { ok: true, next: "confirm" };

  // Signed in immediately: start the first project with the photos they picked.
  let uploadFailed = false;
  try {
    const project = await createDraft(supabase, { type: "listing_video" });
    for (let i = 0; i < input.files.length; i++) {
      onUpload?.(i + 1, input.files.length);
      try {
        await uploadProjectFile(supabase, project, input.files[i], i, () => {});
      } catch {
        uploadFailed = true;
      }
    }
    return { ok: true, next: "app", redirect: `${createPath}?project=${project.id}&step=details`, uploadFailed };
  } catch {
    return { ok: true, next: "app", redirect: createPath, uploadFailed: input.files.length > 0 };
  }
}

export async function signInWithGoogle(locale: string, next?: string) {
  const supabase = getSupabaseBrowser();
  if (!supabase) return;
  const target = next ?? `/${locale}/app/create`;
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}` },
  });
}

export const authProviders = {
  google: authConfig.google,
} as const;
