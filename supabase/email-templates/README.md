# Supabase Auth email templates

Paste each file into **Supabase → Authentication → Email Templates** (Source / HTML), with this subject:

- **confirm-signup.html** → Confirmez votre adresse — Grow Media
- **reset-password.html** → Choisissez un nouveau mot de passe — Grow Media
- **magic-link.html** → Votre lien de connexion — Grow Media
- **invite.html** → Vous êtes invité sur Grow Media
- **change-email.html** → Confirmez votre nouvelle adresse — Grow Media

The mapping: confirm-signup = "Confirm signup", reset-password = "Reset Password", magic-link = "Magic Link", invite = "Invite user", change-email = "Change Email Address".

Regenerate with `npm run emails:auth` after changing the layout in `src/lib/email/templates.ts`.
