# Veritas Android

This is the native Android client for the Veritas workspace. It uses Jetpack Compose and the existing Veritas HTTP API.

## Features

- Cookie-based sign in
- Saved document library
- Mobile writing editor
- Reference URL capture
- Save with server-side revision recording
- Signed export/seal action

## Run locally

Open the `android` directory in Android Studio and let it install the Android Gradle plugin and SDK 35. The default emulator API URL is `http://10.0.2.2:3000`, which maps to the web app running on the host machine at port 3000.

For a physical device, change `API_BASE_URL` in `app/build.gradle.kts` to the host machine's LAN URL and run the web app with `npm run dev`.

This workspace does not currently include a Gradle wrapper or Android SDK, so APK compilation must be performed from Android Studio or a machine with Gradle and SDK 35 installed.