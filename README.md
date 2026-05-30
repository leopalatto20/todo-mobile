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
# Fill in EXPO_PUBLIC_API_URL and Firebase credentials
```

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
