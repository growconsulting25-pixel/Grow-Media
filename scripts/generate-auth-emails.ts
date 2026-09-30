/**
 * Builds the Supabase Auth email templates (confirm sign-up, reset password…)
 * with the same branded layout as the app's emails. Paste each file into
 * Supabase → Authentication → Email Templates. Run: npm run emails:auth
 */
import { writeFileSync } from "node:fs";
import { layout } from "../src/lib/email/templates";

const URL = "{{ .ConfirmationURL }}";
const templates = [
  { file: "confirm-signup", subject: "Confirmez votre adresse — Grow Media", eyebrow: "Bienvenue", heading: "Confirmez votre adresse courriel.", fr: "Merci de vous être inscrit à Grow Media. Confirmez votre adresse pour accéder à votre espace et recevoir votre première vidéo gratuite.", en: "Thanks for signing up. Confirm your email to open your account.", cta: "Confirmer mon adresse" },
  { file: "reset-password", subject: "Choisissez un nouveau mot de passe — Grow Media", eyebrow: "Mot de passe", heading: "Choisissez un nouveau mot de passe.", fr: "Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valide pendant une heure. Si ce n'est pas vous, ignorez ce courriel.", en: "You asked to reset your password. This link is valid for one hour. If it wasn't you, ignore this email.", cta: "Choisir mon mot de passe" },
  { file: "magic-link", subject: "Votre lien de connexion — Grow Media", eyebrow: "Connexion", heading: "Votre lien de connexion.", fr: "Cliquez sur le bouton pour vous connecter à Grow Media. Ce lien ne fonctionne qu'une fois.", en: "Click the button to sign in to Grow Media. This link works once.", cta: "Me connecter" },
  { file: "invite", subject: "Vous êtes invité sur Grow Media", eyebrow: "Invitation", heading: "Vous êtes invité sur Grow Media.", fr: "Un compte a été créé pour vous. Acceptez l'invitation pour choisir votre mot de passe.", en: "An account was created for you. Accept the invitation to choose your password.", cta: "Accepter l'invitation" },
  { file: "change-email", subject: "Confirmez votre nouvelle adresse — Grow Media", eyebrow: "Adresse courriel", heading: "Confirmez votre nouvelle adresse.", fr: "Confirmez ce changement d'adresse courriel pour votre compte Grow Media.", en: "Confirm this email change for your Grow Media account.", cta: "Confirmer" },
];

for (const t of templates) {
  const bodyHtml = `${t.fr}<br><br><span style="font-size:13px;color:#8a9aab">${t.en}</span>`;
  const html = layout({ lang: "fr", preheader: t.fr, eyebrow: t.eyebrow, heading: t.heading, bodyHtml, cta: t.cta, url: URL })
    // Supabase fills the variable; keep it unescaped in the href.
    .replaceAll("{{ .ConfirmationURL }}", URL);
  writeFileSync(`supabase/email-templates/${t.file}.html`, html);
}
writeFileSync(
  "supabase/email-templates/README.md",
  `# Supabase Auth email templates\n\nPaste each file into **Supabase → Authentication → Email Templates** (Source / HTML), with this subject:\n\n${templates.map((t) => `- **${t.file}.html** → ${t.subject}`).join("\n")}\n\nThe mapping: confirm-signup = "Confirm signup", reset-password = "Reset Password", magic-link = "Magic Link", invite = "Invite user", change-email = "Change Email Address".\n\nRegenerate with \`npm run emails:auth\` after changing the layout in \`src/lib/email/templates.ts\`.\n`,
);
console.log(`Wrote ${templates.length} templates to supabase/email-templates/`);
