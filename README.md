# Veritas

Veritas is a browser-native academic authorship verification platform **licensed exclusively to universities**. It captures composition behavior, computes a live authorship health score, checks text similarity against institutional corpus and prior submissions, and seals each submission in a portable .veritas bundle with a SHA-256 hash and an Ed25519 signature.

Universities purchase access codes, customize branding and policy, and provision students and instructors. There are no individual, tutor, or publisher self-serve plans.

## Core product goals

- Capture writing process telemetry: key events, deletes, pastes, focus loss, and timing
- Score organic authorship risk in real time
- Detect similarity against institutional corpora and other submissions
- Seal and verify exports with cryptographic integrity checks
- Support student, instructor, and institutional workflows in a multi-tenant setup

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

## Licensing

| Plan | Focus |
|------|--------|
| University (custom) | Campus licence, Moodle-oriented onboarding, free student writing, instructor review, branding |

Students at onboarded universities: unlimited free writing.

To license Veritas for your institution, contact **support@veritas.io** or use institutional onboarding at `/onboarding?intent=institution`.

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

Roles in product: **ADMIN**, **INSTRUCTOR**, **STUDENT** only.

## Go-live checklist

- [ ] `npm run build` succeeds
- [ ] Seed demo users
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Admin can log in and open `/admin/*`
- [ ] Seal + verify flow works on `/verify`
- [ ] Institutional onboarding path is live for sales
