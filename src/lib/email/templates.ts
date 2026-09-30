/**
 * Transactional email copy (FR/EN). Kept separate from the site dictionaries
 * because it runs server-side and needs its own subject lines.
 */
type Lang = "fr" | "en";

export type EmailKind = "project_received" | "in_production" | "video_ready" | "message" | "revision_complete";

const copy: Record<EmailKind, Record<Lang, { subject: string; heading: string; body: string; cta: string }>> = {
  project_received: {
    fr: { subject: "Projet reçu : {title}", heading: "Nous avons bien reçu votre projet.", body: "Merci {name}! Notre équipe commence la production de « {title} ». Vous recevrez votre vidéo en environ 24 heures.", cta: "Suivre mon projet" },
    en: { subject: "Project received: {title}", heading: "We've received your project.", body: "Thanks {name}! Our team is starting production on “{title}”. Your video will be ready in about 24 hours.", cta: "Track my project" },
  },
  in_production: {
    fr: { subject: "Votre vidéo est en production", heading: "C'est parti!", body: "La production de « {title} » est commencée. Nous vous aviserons dès qu'elle sera prête.", cta: "Voir le projet" },
    en: { subject: "Your video is in production", heading: "We're on it!", body: "Production on “{title}” has started. We'll let you know as soon as it's ready.", cta: "View project" },
  },
  video_ready: {
    fr: { subject: "Votre vidéo est prête : {title}", heading: "Votre vidéo est prête.", body: "« {title} » est prête à publier. Regardez-la, téléchargez-la ou demandez une retouche.", cta: "Voir ma vidéo" },
    en: { subject: "Your video is ready: {title}", heading: "Your video is ready.", body: "“{title}” is ready to post. Watch it, download it or request a revision.", cta: "Watch my video" },
  },
  message: {
    fr: { subject: "Nouveau message : {title}", heading: "Vous avez un nouveau message.", body: "L'équipe de production vous a écrit au sujet de « {title} ».", cta: "Lire le message" },
    en: { subject: "New message: {title}", heading: "You have a new message.", body: "The production team wrote to you about “{title}”.", cta: "Read the message" },
  },
  revision_complete: {
    fr: { subject: "Votre retouche est terminée : {title}", heading: "Votre retouche est prête.", body: "Nous avons appliqué vos modifications à « {title} ».", cta: "Voir la nouvelle version" },
    en: { subject: "Your revision is complete: {title}", heading: "Your revision is ready.", body: "We've applied your changes to “{title}”.", cta: "See the new version" },
  },
};

const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k: string) => v[k] ?? m);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Shared layout: brand line, heading, body (already-escaped HTML), optional rows and a button. */
function layout(lang: Lang, heading: string, bodyHtml: string, cta: string, url: string, rows: [string, string][] = []) {
  const table = rows.length
    ? `<tr><td style="padding-top:16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3e8ee">${rows
        .map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;font-size:13px;color:#62758a;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;font-size:14px;color:#0b1622">${esc(v)}</td></tr>`)
        .join("")}</table></td></tr>`
    : "";
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#0b1622">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px">
<tr><td style="font-size:18px;font-weight:700;color:#0b1622">Grow <span style="color:#00abff">Media</span></td></tr>
<tr><td style="padding-top:24px;font-size:22px;font-weight:700">${esc(heading)}</td></tr>
<tr><td style="padding-top:12px;font-size:15px;line-height:1.6;color:#4f6275">${bodyHtml}</td></tr>${table}
<tr><td style="padding-top:24px"><a href="${esc(url)}" style="display:inline-block;background:#0096e0;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">${esc(cta)}</a></td></tr>
</table></td></tr></table></body></html>`;
}

export function renderEmail(kind: EmailKind, lang: Lang, vars: { name: string; title: string; url: string }) {
  const c = copy[kind][lang];
  const safe = { name: esc(vars.name), title: esc(vars.title) };
  const subject = fill(c.subject, { name: vars.name, title: vars.title });
  const html = layout(lang, c.heading, fill(esc(c.body), safe), c.cta, vars.url);
  const text = `${c.heading}\n\n${fill(c.body, { name: vars.name, title: vars.title })}\n\n${c.cta}: ${vars.url}`;
  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Staff alerts (French: the production team's language)
// ---------------------------------------------------------------------------
export type StaffAlertKind =
  | "new_client" | "new_project" | "client_message" | "revision_requested"
  | "subscription_started" | "subscription_canceled" | "payment";

const staffCopy: Record<StaffAlertKind, { subject: string; heading: string; cta: string }> = {
  new_client: { subject: "Nouveau client : {name}", heading: "Un nouveau client s'est inscrit.", cta: "Ouvrir l'admin" },
  new_project: { subject: "Nouveau projet à produire : {title}", heading: "Un projet vient d'être envoyé.", cta: "Ouvrir le projet" },
  client_message: { subject: "Message de {name} : {title}", heading: "Un client vous a écrit.", cta: "Répondre" },
  revision_requested: { subject: "Retouche demandée : {title}", heading: "Un client demande une retouche.", cta: "Voir la demande" },
  subscription_started: { subject: "Nouvel abonné : {name}", heading: "Un client vient de s'abonner.", cta: "Ouvrir l'admin" },
  subscription_canceled: { subject: "Abonnement annulé : {name}", heading: "Un client a annulé son abonnement.", cta: "Ouvrir l'admin" },
  payment: { subject: "Paiement reçu : {amount} — {name}", heading: "Un paiement a été reçu.", cta: "Ouvrir l'admin" },
};

export function renderStaffAlert(
  kind: StaffAlertKind,
  vars: { name: string; email: string; title: string; amount: string; url: string; rows: [string, string][] },
) {
  const c = staffCopy[kind];
  const v = { name: vars.name, title: vars.title, amount: vars.amount };
  const subject = fill(c.subject, v);
  const rows: [string, string][] = [["Client", `${vars.name} <${vars.email}>`], ...vars.rows];
  const html = layout("fr", c.heading, esc(subject), c.cta, vars.url, rows);
  const text = `${c.heading}\n\n${rows.map(([k, val]) => `${k} : ${val}`).join("\n")}\n\n${c.cta} : ${vars.url}`;
  return { subject, html, text };
}

/** Welcome email for a new admin: they set their own password (nothing secret in the email). */
export function renderAdminInvite(lang: Lang, vars: { name: string; invitedBy: string; url: string; email: string }) {
  const c =
    lang === "en"
      ? { subject: "You've been added to the Grow Media team", heading: "Welcome to the team.", body: `Hi {name}, {by} gave you admin access to Grow Media. Choose your password to sign in with {email}.`, cta: "Choose my password" }
      : { subject: "Vous avez été ajouté à l'équipe Grow Media", heading: "Bienvenue dans l'équipe.", body: `Bonjour {name}, {by} vous a donné l'accès administrateur à Grow Media. Choisissez votre mot de passe pour vous connecter avec {email}.`, cta: "Choisir mon mot de passe" };
  const v = { name: vars.name, by: vars.invitedBy, email: vars.email };
  const safe = { name: esc(vars.name), by: esc(vars.invitedBy), email: esc(vars.email) };
  return {
    subject: c.subject,
    html: layout(lang, c.heading, fill(esc(c.body), safe), c.cta, vars.url),
    text: `${c.heading}\n\n${fill(c.body, v)}\n\n${c.cta}: ${vars.url}`,
  };
}
