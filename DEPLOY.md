# Deploy notes

## Vercel

- Framework: **Next.js** (web app only).
- `mobile/` (Expo) and `android/` are excluded from `tsconfig.json` so typecheck does not require React Native packages.
- **Node**: `20.x` (set in `package.json` engines and respected by Vercel).
- **Build command**: `next build` (do **not** require `prisma generate` — runtime uses the SQLite facade in `lib/db.ts`, not `@prisma/client`).
- **SQLite / better-sqlite3**: native module; `serverExternalPackages` in `next.config.ts` keeps it external. On Vercel the DB path uses `/tmp` (ephemeral per instance). For durable production data, move to Postgres/Turso later.

### Required environment variables on Vercel

```
NEXT_PUBLIC_APP_URL="https://your-deployment.vercel.app"
NODE_ENV="production"
```

Optional (recommended):

```
DATABASE_URL="file:/tmp/veritas-data/veritas.db"
JWT_SECRET="long-random-string"
STRIPE_SECRET_KEY=""
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
```

### If a deploy fails

1. Open **Vercel → Deployments → failed deployment → Building** logs.
2. Common causes:
   - Missing Node 20 (set in Project Settings → Node.js Version).
   - `prisma generate` in build command without `DATABASE_URL` — remove it; this app does not need Prisma at runtime.
   - TypeScript errors on `TUTOR` role — fixed by creating tutors as `STUDENT` then promoting in SQL.
3. Redeploy from the Vercel dashboard: **Deployments → Redeploy** the latest `main` commit.

### Demo logins (seeded on first DB open)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@veritas.io | admin123 |
| Instructor | instructor@veritas.io | instructor123 |
| Student | student@veritas.io | student123 |
| Tutor | tutor@veritas.io | tutor123 |
