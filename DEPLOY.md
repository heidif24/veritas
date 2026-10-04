# Deploy notes

## Vercel

- Framework: **Next.js** (web app only).
- `mobile/` (Expo) and `android/` are excluded from `tsconfig.json` so typecheck does not require React Native packages.
- **Node**: `20.x` (set in `package.json` engines and respected by Vercel).
- **Prisma**: `@prisma/client` and `prisma` must stay on the **same major/minor** (currently `7.10.0`). A CLI/client mismatch breaks `prisma generate` on Vercel.
- **Build**: `prisma generate && next build` (also in `postinstall`).
- **SQLite / better-sqlite3**: native module; `serverExternalPackages` in `next.config.ts` keeps it external. On Vercel the DB path uses `/tmp` (ephemeral). For durable production data, move to Postgres/Turso later.

### Required environment variables on Vercel

```
DATABASE_URL="file:/tmp/veritas-data/veritas.db"
NEXT_PUBLIC_APP_URL="https://your-deployment.vercel.app"
NODE_ENV="production"
```

Optional: `JWT_SECRET`, payment keys, etc.

Redeploy from the Vercel dashboard if a Git webhook did not fire: **Deployments → Redeploy** the latest `main` commit.
