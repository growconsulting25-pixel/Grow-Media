import "server-only";
import { cookies } from "next/headers";

export type Theme = "dark" | "light";
export const THEME_COOKIE = "gm-theme";

/** The signed-in area's theme (client app + admin console), from a cookie so there's no flash. */
export async function getTheme(): Promise<Theme> {
  return (await cookies()).get(THEME_COOKIE)?.value === "light" ? "light" : "dark";
}
