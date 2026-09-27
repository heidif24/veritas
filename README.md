# Veritas

Veritas is a browser-native academic authorship verification platform for universities and academic institutions. It captures composition behavior, computes a live authorship health score, checks text similarity against institutional corpus and prior submissions, and seals each submission in a portable .veritas bundle with a SHA-256 hash and an Ed25519 signature.

## Core product goals

- Capture writing process telemetry: key events, deletes, pastes, focus loss, and timing
- Score organic authorship risk in real time
- Detect similarity against institutional corpora and other submissions
- Seal and verify exports with cryptographic integrity checks
- Support student, faculty, and institutional workflows in a multi-tenant setup

## Key demo accounts

- Admin: admin@veritas.io / admin123
- Instructor: instructor@veritas.io / instructor123
- Student: student@veritas.io / student123

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Environment variables

Create a .env.local file with the following values:

```bash
DATABASE_URL="file:./data/veritas.db"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# STRIPE_SECRET_KEY=
# PAYPAL_CLIENT_ID=
# PAYPAL_CLIENT_SECRET=
# PAYPAL_MODE=sandbox
```

## Production build and tests

```bash
npm test
npm run build
npm run start
```

## Pricing (market)

| Plan | Price | Focus |
|------|-------|--------|
| Individual | $15/month | Process monitoring + cryptographic seals |
| Publisher | $40/month | Process + seal + editorial queues |
| Institution | Custom | Campus LTI, proctoring, free student writing |

Students at onboarded universities: unlimited free writing.

## Payments

Checkout at `/api/payments/checkout` for **Stripe (card)** and **PayPal**.

Set `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` from env.
Without keys, pricing returns a demo success URL so flows can be tested.

Stripe webhook: `POST /api/payments/webhook`  
PayPal capture: `POST /api/payments/paypal/capture`

## Product priority

**Primary:** process monitoring + cryptographic sealing  
**Additional:** AI, plagiarism, proctoring, Canvas/Moodle LTI, fairness

## Auth (demo)

| Role | Email | Password |
|------|-------|----------|
| Super admin | admin@veritas.io | admin123 |
| Instructor | instructor@veritas.io | instructor123 |
| Student | student@veritas.io | student123 |

Protected routes: `/app/*`, `/instructor/*`, `/admin/*`, `/student/*`.

## Firebase path

Current: Next.js + SQLite + cookie sessions. Attach Firebase Auth later via Admin `verifyIdToken` and migrate data to Firestore/Postgres.

## Go-live checklist

- [ ] `npm run build` succeeds
- [ ] Seed demo users
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Add Stripe + PayPal production keys
- [ ] Configure Stripe webhook
- [ ] Admin can log in and open `/admin/*`
- [ ] Seal + verify flow works on `/verify`
