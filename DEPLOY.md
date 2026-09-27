# Deploy notes

- Production builds the **Next.js web app** only.
- `mobile/` (Expo) and `android/` are excluded from `tsconfig.json` so Vercel typecheck does not require React Native packages.
- Latest web fixes: shield logo, boot splash animation, locale provider, denser homepage.

Redeploy from the Vercel dashboard if a Git webhook did not fire: **Deployments → Redeploy** the latest `main` commit.
