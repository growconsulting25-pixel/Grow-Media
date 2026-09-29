import "server-only";

/** Sends one email through Resend's HTTP API (no SDK dependency). */
export async function sendEmail(input: { to: string; subject: string; html: string; text: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Grow Media <media@growconsulting.ca>";
  if (!key) return { ok: false as const, error: "RESEND_API_KEY missing" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [input.to], subject: input.subject, html: input.html, text: input.text }),
  });
  if (!res.ok) return { ok: false as const, error: `${res.status} ${await res.text()}` };
  return { ok: true as const };
}
