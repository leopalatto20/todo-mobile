# Expo SDK 54 — read exact versioned docs before coding

https://docs.expo.dev/versions/v54.0.0/

## Commands

| Action    | Command                      |
| --------- | ---------------------------- |
| Start dev | `npx expo start`             |
| iOS       | `npx expo start --ios`       |
| Android   | `npx expo start --android`   |
| Web       | `npx expo start --web`       |
| Lint      | `npm run lint` (`expo lint`) |

Package manager: **Bun** — use `bun add` / `bun install`

No test framework. No CI.

## Architecture

```
app/        # File-based routes (expo-router). _layout.tsx is root
config/     # Firebase app init (`initializeAuth` with AsyncStorage persistence)
types/      # Manual interfaces matching REST API responses
services/   # Axios CRUD per entity. api.ts creates client with auth interceptor
stores/     # Zustand with persist (AsyncStorage). Single authStore
hooks/      # TanStack Query v5 wrappers around services
utils/      # Date formatters, etc.
components/ui/ # gluestack-ui components (Box, Text, Heading, Button, Input, etc.)
```

Entry: `expo-router/entry` (package.json `main`).

## Data flow

**Screen → Hook (TanStack Query) → Service (Axios) → REST API**

Auth: **Firebase Auth → Zustand store → Axios interceptor** (`useAuthStore.getState().token`)

Env vars: `EXPO_PUBLIC_*` prefix. Copy `.env.example` to `.env`.

## Styling

**NativeWind v4** with `className` props and Tailwind utilities. Import `@/global.css` in root layout. All screens use `className` — never `StyleSheet.create`.

**GluestackUI v3** (`@gluestack-ui/core`) wraps the app via `<GluestackUIProvider>` in `app/_layout.tsx`. Custom RGB color tokens defined in `tailwind.config.js` (`bg-background-0`, `text-typography-950`, `bg-primary-500`, etc.).

**Gluestack components** are installed via `npx gluestack-ui add <name>` (scaffolds local files at `components/ui/<name>/` and installs deps). Import from `@/components/ui/<name>`. Currently installed: `box`, `text`, `heading`, `button`, `input`, `form-control`, `spinner`, `vstack`. When adding a new UI component, always use `npx gluestack-ui add <name> --use-bun`. Never hand-roll common interactive components that gluestack provides.

Metro: wrapped with `withNativeWind(config, { input: './global.css' })`.

## Tooling

- **TypeScript**: strict mode, `@/*` → `./*` path alias (tsconfig.json + babel-plugin-module-resolver)
- **New Architecture**: enabled (`newArchEnabled: true` in app.json)
- **Expo experiments**: `typedRoutes` and `reactCompiler` enabled
- **Metro / Babel**: `babel-preset-expo`, `nativewind/babel`, `react-native-worklets/plugin`
- **Formatter**: Prettier with `prettier-plugin-tailwindcss`

## Known issues

- `npm run lint` / `npx tsc` report `import/no-unresolved` for `@/*` — Expo ESLint config limitation. Metro resolves them correctly at runtime.
- `.env` is gitignored; `.env.example` has the schema.

## Available skills

Load with `skill` tool — installed via `skills-lock.json`:

- `building-native-ui` — native component patterns
- `expo-api-routes` — server-side API routes
- `expo-module` — native module creation
- `expo-tailwind-setup` — Tailwind CSS setup for Expo
- `native-data-fetching` — React Native data fetching
- `upgrading-expo` — SDK upgrade guidance
