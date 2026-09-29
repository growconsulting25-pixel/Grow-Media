/**
 * Auth boundary. Phase 2 replaces this stub with Supabase Auth
 * (`supabase.auth.signUp`, OAuth for Google). Components only depend on this
 * interface, so the UI does not change when the backend lands.
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

export type SignupResult = { ok: true } | { ok: false; reason: "not_configured" | "error"; message?: string };

export async function signUp(input: SignupInput): Promise<SignupResult> {
  void input;
  // Intentionally not faking success: no account is created until the backend exists.
  return { ok: false, reason: "not_configured" };
}

export const authProviders = {
  google: false,
} as const;
