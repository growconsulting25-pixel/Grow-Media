/**
 * Scheduled every 5 minutes: asks the app to email any pending notifications
 * (video ready, new message, …). The work itself lives in /api/email/dispatch.
 */
const dispatchEmails = async () => {
  const base = process.env.URL;
  if (!base || !process.env.CRON_SECRET) return new Response("not configured", { status: 200 });
  const res = await fetch(`${base}/api/email/dispatch`, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  return new Response(await res.text(), { status: res.status });
};

export default dispatchEmails;

export const config = { schedule: "*/5 * * * *" };
