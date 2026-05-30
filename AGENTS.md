# Expo SDK 54 — read exact versioned docs before coding

https://docs.expo.dev/versions/v54.0.0/

## Commands

| Action      | Command                      |
| ----------- | ---------------------------- |
| Start dev   | `npx expo start`             |
| iOS         | `npx expo start --ios`       |
| Android     | `npx expo start --android`   |
| Web         | `npx expo start --web`       |
| Lint        | `npm run lint` (`expo lint`) |
| Format      | `npm run format`             |

Package manager: **Bun** — `bun add` / `bun install`

No test framework. No CI.

## Architecture

```
app/         # File-based routes (expo-router). _layout.tsx = root Stack
app/(tabs)/  # Tab layout. _layout.tsx = Tabs navigator
config/      # Firebase init (initializeAuth + AsyncStorage persistence)
types/       # Manual TS interfaces matching REST responses
services/    # Axios CRUD per entity. api.ts = client + auth interceptor
stores/      # Zustand w/ persist (AsyncStorage). Single authStore
hooks/       # TanStack Query v5 wrappers around services
utils/       # Date formatters, color resolvers, priority helpers
components/ui/ # gluestack-ui scaffolded components (Box, Text, Button, Input, Toast, etc.)
```

Entry: `expo-router/entry` (package.json `main`).

## Data flow

**Screen → Hook (TanStack Query) → Service (Axios) → REST API**

Auth: **Firebase Auth → Zustand store → Axios interceptor** (`useAuthStore.getState().token`)

Env vars: `EXPO_PUBLIC_*` prefix. Copy `.env.example` to `.env`.

## Navigation gotchas

- Root Stack (`app/_layout.tsx`) has `headerShown: false`. Screens must wrap in `SafeAreaView` or add custom headers.
- Tab layout (`app/(tabs)/_layout.tsx`) also has `headerShown: false`. Each tab screen renders a custom heading with `border-b border-outline-200`.
- Auth redirect: use `CommonActions.reset` from `@react-navigation/native` (not `router.replace`) to fully purge login/signup from back stack.
- Delete handlers: `router.back()` first, then fire `mutateAsync` (optimistic — mutation hooks handle cache rollback on error via `onMutate`/`onError`).
- Detail pages (`/todo/[id]`, `/category/[id]`) have manual back buttons since root headers are hidden.

## Styling

**NativeWind v4** with `className` props and Tailwind utilities. Import `@/global.css` in root layout. Never `StyleSheet.create`.

**GluestackUI v3** (`@gluestack-ui/core`) wraps via `<GluestackUIProvider>` in `app/_layout.tsx`. Custom RGB color tokens in `tailwind.config.js` (`bg-background-0`, `text-typography-950`, `bg-primary-500`, etc.).

**Adding components**: `npx gluestack-ui add <name> --use-bun`. Scaffolds files at `components/ui/<name>/`. Import from `@/components/ui/<name>`. Never hand-roll common interactive components.

Metro: `withNativeWind(config, { input: './global.css' })`.

## TanStack Query patterns

- **Optimistic updates**: `useMutation` with `onMutate` (cancel queries → snapshot → apply), `onError` (rollback), `onSettled` (invalidate).
- **Query keys**: Explicit objects (`todoKeys.all`, `todoKeys.detail(id)`) defined per hook file.
- Mutations expose both `mutate` (fire-and-forget) and `mutateAsync` (promise). Detail screens use `mutate` for saves, `mutateAsync` for deletes.

## Known issues

- `npm run lint` reports `import/no-unresolved` for `@/*` — Expo ESLint config limitation. Metro resolves correctly at runtime.
- `.env` is gitignored; `.env.example` has the schema.
