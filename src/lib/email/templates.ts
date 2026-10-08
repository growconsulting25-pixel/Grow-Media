/**
 * Transactional email copy (FR/EN) and the branded layout every email shares:
 * navy header with the logo, a cyan accent line, a white card, a bulletproof
 * button and a footer. Table-based and inline-styled for email clients.
 */
import { siteConfig } from "@/config/site";

type Lang = "fr" | "en";

export type EmailKind = "project_received" | "in_production" | "video_ready" | "message" | "revision_complete";

type Copy = { eyebrow: string; subject: string; heading: string; body: string; cta: string };

const copy: Record<EmailKind, Record<Lang, Copy>> = {
  project_received: {
    fr: { eyebrow: "Projet reçu", subject: "Projet reçu : {title}", heading: "Nous avons bien reçu votre projet.", body: "Merci {name}! Notre équipe commence la production de « {title} ». Vous recevrez votre vidéo en environ 24 heures.", cta: "Suivre mon projet" },
    en: { eyebrow: "Project received", subject: "Project received: {title}", heading: "We've received your project.", body: "Thanks {name}! Our team is starting production on “{title}”. Your video will be ready in about 24 hours.", cta: "Track my project" },
  },
  in_production: {
    fr: { eyebrow: "En production", subject: "Votre vidéo est en production", heading: "C'est parti!", body: "La production de « {title} » est commencée. Nous vous aviserons dès qu'elle sera prête.", cta: "Voir le projet" },
    en: { eyebrow: "In production", subject: "Your video is in production", heading: "We're on it!", body: "Production on “{title}” has started. We'll let you know as soon as it's ready.", cta: "View project" },
  },
  video_ready: {
    fr: { eyebrow: "Vidéo prête", subject: "Votre vidéo est prête : {title}", heading: "Votre vidéo est prête.", body: "« {title} » est prête à publier. Regardez-la, téléchargez-la ou demandez une retouche.", cta: "Voir ma vidéo" },
    en: { eyebrow: "Video ready", subject: "Your video is ready: {title}", heading: "Your video is ready.", body: "“{title}” is ready to post. Watch it, download it or request a revision.", cta: "Watch my video" },
  },
  message: {
    fr: { eyebrow: "Nouveau message", subject: "Nouveau message : {title}", heading: "Vous avez un nouveau message.", body: "L'équipe de production vous a écrit au sujet de « {title} ».", cta: "Lire le message" },
    en: { eyebrow: "New message", subject: "New message: {title}", heading: "You have a new message.", body: "The production team wrote to you about “{title}”.", cta: "Read the message" },
  },
  revision_complete: {
    fr: { eyebrow: "Retouche terminée", subject: "Votre retouche est terminée : {title}", heading: "Votre retouche est prête.", body: "Nous avons appliqué vos modifications à « {title} ».", cta: "Voir la nouvelle version" },
    en: { eyebrow: "Revision complete", subject: "Your revision is complete: {title}", heading: "Your revision is ready.", body: "We've applied your changes to “{title}”.", cta: "See the new version" },
  },
};

const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k: string) => v[k] ?? m);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const FONT = "'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const footerCopy: Record<Lang, { tagline: string; note: string }> = {
  fr: { tagline: "Vidéos immobilières professionnelles, livrées en 24 h.", note: "Vous recevez ce courriel au sujet de votre compte Grow Media." },
  en: { tagline: "Professional real estate videos, delivered in 24 h.", note: "You're receiving this email about your Grow Media account." },
};

interface LayoutInput {
  lang: Lang;
  preheader: string;
  eyebrow: string;
  /** Eyebrow color (cyan for clients; per-alert colors for staff). */
  tone?: string;
  heading: string;
  bodyHtml: string;
  rows?: [string, string][];
  cta: string;
  url: string;
  footerNote?: string;
}

/** The shared premium layout. Values in `rows` are escaped here; `bodyHtml` must already be safe. */
export function layout({ lang, preheader, eyebrow, tone = "#b8770f", heading, bodyHtml, rows = [], cta, url, footerNote }: LayoutInput) {
  const site = siteConfig.url;
  const f = footerCopy[lang];
  const details = rows.length
    ? `<tr><td style="padding:24px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f3;border-radius:14px">${rows
        .map(([k, v], i) => `<tr><td style="padding:${i ? "0" : "14px"} 18px 12px;font:500 12px/1.4 ${FONT};color:#64757a;white-space:nowrap;vertical-align:top;width:1%">${esc(k)}</td><td style="padding:${i ? "0" : "14px"} 18px 12px 0;font:14px/1.5 ${FONT};color:#16292d">${esc(v)}</td></tr>`)
        .join("")}</table></td></tr>`
    : "";
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:#f4f1ea;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea"><tr><td align="center" style="padding:36px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
  <tr><td style="background:#16292d;border-radius:20px 20px 0 0;padding:26px 36px">
    <a href="${esc(site)}" style="text-decoration:none"><img src="${esc(site)}/email/logo-white.png" width="106" height="34" alt="Grow Media" style="display:block;border:0;width:106px;height:34px"></a>
  </td></tr>
  <tr><td style="height:3px;line-height:3px;font-size:0;background:#f5a623">&nbsp;</td></tr>
  <tr><td style="background:#ffffff;padding:36px 36px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="font:600 12px/1 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${tone}">${esc(eyebrow)}</td></tr>
      <tr><td style="padding-top:14px;font:700 26px/1.25 ${FONT};letter-spacing:-.02em;color:#16292d">${esc(heading)}</td></tr>
      <tr><td style="padding-top:14px;font:16px/1.65 ${FONT};color:#4c5f63">${bodyHtml}</td></tr>
      ${details}
      <tr><td style="padding-top:28px">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#b8770f;border-radius:999px">
          <a href="${esc(url)}" style="display:inline-block;padding:14px 28px;font:600 15px/1 ${FONT};color:#ffffff;text-decoration:none;border-radius:999px">${esc(cta)} &rarr;</a>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding-top:18px;font:12px/1.5 ${FONT};color:#8fa3a8;word-break:break-all">${lang === "en" ? "Or open" : "Ou ouvrez"} <a href="${esc(url)}" style="color:#8a560a">${esc(url)}</a></td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#ffffff;border-top:1px solid #e4ddd0;border-radius:0 0 20px 20px;padding:20px 36px 24px;font:12px/1.6 ${FONT};color:#8fa3a8">
    <strong style="color:#16292d">Grow Media</strong> · ${esc(f.tagline)}<br>
    <a href="${esc(site)}" style="color:#8a560a;text-decoration:none">${esc(site.replace(/^https?:\/\//, ""))}</a> · <a href="mailto:${siteConfig.contactEmail}" style="color:#8a560a;text-decoration:none">${siteConfig.contactEmail}</a>
  </td></tr>
  <tr><td align="center" style="padding:18px 12px 0;font:11px/1.5 ${FONT};color:#8fa3a8">${esc(footerNote ?? f.note)}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export function renderEmail(kind: EmailKind, lang: Lang, vars: { name: string; title: string; url: string }) {
  const c = copy[kind][lang];
  const plain = { name: vars.name, title: vars.title };
  const subject = fill(c.subject, plain);
  const body = fill(c.body, plain);
  const html = layout({ lang, preheader: body, eyebrow: c.eyebrow, heading: c.heading, bodyHtml: fill(esc(c.body), { name: esc(vars.name), title: esc(vars.title) }), cta: c.cta, url: vars.url });
  const text = `${c.heading}\n\n${body}\n\n${c.cta}: ${vars.url}`;
  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Staff alerts (French: the production team's language)
// ---------------------------------------------------------------------------
export type StaffAlertKind =
  | "new_client" | "new_project" | "client_message" | "revision_requested"
  | "subscription_started" | "subscription_canceled" | "payment" | "contact_request";

const staffCopy: Record<StaffAlertKind, { label: string; tone: string; subject: string; heading: string; cta: string }> = {
  new_client: { label: "Nouveau client", tone: "#b8770f", subject: "Nouveau client : {name}", heading: "Un nouveau client s'est inscrit.", cta: "Voir le client" },
  new_project: { label: "Nouveau projet", tone: "#d97706", subject: "Nouveau projet à produire : {title}", heading: "Un projet vient d'être envoyé.", cta: "Ouvrir le projet" },
  client_message: { label: "Message client", tone: "#2563eb", subject: "Message de {name} : {title}", heading: "Un client vous a écrit.", cta: "Répondre" },
  revision_requested: { label: "Retouche demandée", tone: "#e11d48", subject: "Retouche demandée : {title}", heading: "Un client demande une retouche.", cta: "Voir la demande" },
  subscription_started: { label: "Nouvel abonné", tone: "#059669", subject: "Nouvel abonné : {name}", heading: "Un client vient de s'abonner.", cta: "Voir le client" },
  subscription_canceled: { label: "Annulation", tone: "#e11d48", subject: "Abonnement annulé : {name}", heading: "Un client a annulé son abonnement.", cta: "Voir le client" },
  payment: { label: "Paiement reçu", tone: "#ea580c", subject: "Paiement reçu : {amount} — {name}", heading: "Un paiement a été reçu.", cta: "Voir les finances" },
  contact_request: { label: "Formulaire de contact", tone: "#0891b2", subject: "Nouveau message du site : {name}", heading: "Quelqu'un vous a écrit depuis le site.", cta: "Répondre" },
};

export function renderStaffAlert(
  kind: StaffAlertKind,
  vars: { name: string; email: string; title: string; amount: string; url: string; rows: [string, string][] },
) {
  const c = staffCopy[kind];
  const v = { name: vars.name, title: vars.title, amount: vars.amount };
  const subject = fill(c.subject, v);
  const who = kind === "contact_request" ? "Visiteur" : "Client";
  const rows: [string, string][] = [[who, vars.email ? `${vars.name} · ${vars.email}` : vars.name], ...vars.rows];
  const html = layout({
    lang: "fr", preheader: subject, eyebrow: `Équipe · ${c.label}`, tone: c.tone, heading: c.heading, bodyHtml: esc(subject), rows, cta: c.cta, url: vars.url,
    footerNote: "Alerte envoyée à l'équipe Grow Media. Retrouvez tout l'historique dans l'onglet Activité de l'admin.",
  });
  const text = `${c.heading}\n\n${rows.map(([k, val]) => `${k} : ${val}`).join("\n")}\n\n${c.cta} : ${vars.url}`;
  return { subject, html, text };
}

/** Welcome email for a new admin: they set their own password (nothing secret in the email). */
export function renderAdminInvite(lang: Lang, vars: { name: string; invitedBy: string; url: string; email: string }) {
  const c =
    lang === "en"
      ? { eyebrow: "Team access", subject: "You've been added to the Grow Media team", heading: "Welcome to the team.", body: `Hi {name}, {by} gave you admin access to Grow Media. Choose your password to sign in with {email}.`, cta: "Choose my password" }
      : { eyebrow: "Accès équipe", subject: "Vous avez été ajouté à l'équipe Grow Media", heading: "Bienvenue dans l'équipe.", body: `Bonjour {name}, {by} vous a donné l'accès administrateur à Grow Media. Choisissez votre mot de passe pour vous connecter avec {email}.`, cta: "Choisir mon mot de passe" };
  const v = { name: vars.name, by: vars.invitedBy, email: vars.email };
  const body = fill(c.body, v);
  return {
    subject: c.subject,
    html: layout({ lang, preheader: body, eyebrow: c.eyebrow, heading: c.heading, bodyHtml: fill(esc(c.body), { name: esc(vars.name), by: esc(vars.invitedBy), email: esc(vars.email) }), cta: c.cta, url: vars.url }),
    text: `${c.heading}\n\n${body}\n\n${c.cta}: ${vars.url}`,
  };
}
