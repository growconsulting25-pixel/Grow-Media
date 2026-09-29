import "server-only";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Staff gate for /admin. Returns a session client — every read/write still
 * goes through RLS, where `is_admin()` grants staff access.
 */
export async function requireAdmin() {
  const session = await getCurrentUser();
  if (!session) notFound();
  const { data } = await session.supabase.from("profiles").select("role, first_name").eq("id", session.user.id).single();
  if (data?.role !== "admin") notFound();
  return { ...session, firstName: (data.first_name as string) ?? "" };
}
