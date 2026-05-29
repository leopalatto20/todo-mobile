# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Commands

| Action | Command |
|---|---|
| Start dev | `npx expo start` |
| iOS | `npx expo start --ios` |
| Android | `npx expo start --android` |
| Lint | `npm run lint` (runs `expo lint`) |

Package manager: **Bun** (bun.lock present). Use `bun add` / `bun install`.

No test framework configured. No CI.

## Project conventions

- **Entry**: `expo-router/entry` (package.json `main`). File-based routes in `app/`.
- **Path alias**: `@/*` → `./*` (configured in tsconfig.json).
- **TypeScript**: strict mode.
- **New Architecture**: enabled (`"newArchEnabled": true` in app.json).
- **Expo experiments**: `typedRoutes` (type-safe `router.push()`) and `reactCompiler` enabled.
- **Style**: React Native `StyleSheet` / inline styles — no Tailwind or styled-system.
- **Splash screen**: configured via `expo-splash-screen` plugin in app.json.

## Architecture

```
src/
  config/     # Firebase app init
  types/      # Manual interfaces matching OpenAPI spec
  services/   # Axios CRUD functions per entity
  stores/     # Zustand (auth with persist)
  hooks/      # TanStack Query wrappers
  utils/      # Date formatters, etc.
```

Data flow: **Screen → Hook (TanStack Query) → Service (Axios) → REST API**
Auth: **Firebase Auth → Zustand store → Axios interceptor** (token via `useAuthStore.getState().token`)

**Known lint issue:** `npm run lint` reports `import/no-unresolved` for `@/*` path aliases. This is an Expo ESLint config limitation — paths resolve correctly at runtime via Metro. `npx tsc` has the same limitation.

## Available skills

Installed via `skills-lock.json` — load with `skill` tool:
- `building-native-ui` — native component patterns
- `expo-api-routes` — server-side API routes (if applicable)
- `expo-module` — native module creation
- `expo-tailwind-setup` — Tailwind CSS setup (not yet installed)
- `native-data-fetching` — React Native data fetching
- `upgrading-expo` — SDK upgrade guidance
