# Todo Mobile

Expo/React Native todo app with Firebase Auth and a REST API backend.

Built with Expo SDK 54, expo-router (file-based routing), NativeWind v4 + Tailwind CSS, gluestack-ui v3, TanStack Query v5, Zustand, and Axios.

## Prerequisites

- [Bun](https://bun.sh) (package manager)
- iOS Simulator (Xcode) or Android Emulator
- Backend API running (see `.env.example` for required vars)

## Setup

```bash
bun install
cp .env.example .env
```

## Environment Variables

All vars prefixed with `EXPO_PUBLIC_`. Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend REST API base URL |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

## Run

```bash
npx expo start
# Then press 'i' for iOS, 'a' for Android, 'w' for web
```

## Lint & Format

```bash
npm run lint
npm run format
```

## Architecture

| Directory     | Purpose                                    |
| ------------- | ------------------------------------------ |
| `app/`        | File-based routes (expo-router)            |
| `config/`     | Firebase init with AsyncStorage persistence|
| `types/`      | TypeScript interfaces matching REST API    |
| `services/`   | Axios CRUD per entity                      |
| `stores/`     | Zustand auth store (persisted)             |
| `hooks/`      | TanStack Query wrappers around services    |
| `components/` | UI components (gluestack + domain)         |

Auth flow: **Firebase Auth → Zustand store → Axios interceptor** (`Bearer` token).
