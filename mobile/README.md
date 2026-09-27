# Veritas Mobile (React Native / Expo)

Cross-platform companion app for iOS and Android. Talks to the same Veritas HTTP API as the web app and the existing native Android client.

## Features

- Sign in (cookie session against `/api/auth/login`)
- Document library (`/api/documents`)
- Draft editor with save (`PATCH /api/documents/:id`)
- Seal / signed export (`POST /api/documents/:id/seal`)

## Setup

```bash
cd mobile
npm install
```

Set your API base URL (deployed site or local machine):

```bash
export EXPO_PUBLIC_API_URL=https://your-veritas-deployment.vercel.app
# emulator → host machine: http://10.0.2.2:3000 (Android) or http://localhost:3000 (iOS sim)
```

## Run

```bash
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

## Notes

- Cookie-based auth works best when the API and app share a reachable host; for production, consider migrating mobile to token auth.
- The legacy Jetpack Compose client remains under `/android` for pure-native Android builds.
