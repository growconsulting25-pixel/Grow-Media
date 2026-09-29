/**
 * Supabase configuration. When the variables are missing the site still
 * builds and runs: auth screens explain that accounts aren't open yet.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const authConfig = {
  google: process.env.NEXT_PUBLIC_AUTH_GOOGLE === "true",
} as const;
