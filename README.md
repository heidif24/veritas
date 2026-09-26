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
```

## Production build and tests

```bash
npm test
npm run build
npm run start
```

## Deployment options

### Docker

```bash
docker build -t veritas .
docker run -p 3000:3000 veritas
```

### Vercel / Node host

- Set the environment variables above
- Deploy this repository as a Next.js app
- Ensure the application can write to the local SQLite file or switch to a managed Postgres instance for production multi-tenant use

## Important product flows

- Student writes and saves work inside the editor
- Document can be sealed via the seal endpoint to produce a signed .veritas JSON bundle
- External verifiers upload the sealed bundle to /verify to confirm the hash + signature
- Instructors review submissions and compare them against corpus and assignment thresholds

## Project structure

- app/ — routes and pages for student, instructor, admin, and verifier views
- app/api/ — server routes for auth, documents, verification, and admin data
- lib/ — data access, auth helpers, and Veritas scoring + seal logic
- data/ — local SQLite database
- scripts/ — seeding and helper scripts

## Roadmap notes

This version implements the operational core required for a pilot environment:

- real login and registration flow
- seeded University of Jos data
- document sealing and bundle verification
- health scoring and originality checks
- instructor/admin route infrastructure
- deployable Next.js app with Docker support
