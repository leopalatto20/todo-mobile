# Gluestack UI Component Refactor

**Date:** 2026-05-28
**Project:** todo-mobile

## Goal

Replace raw React Native primitives (`View`, `Text`, `TextInput`, `TouchableOpacity`, `ActivityIndicator`) with equivalent gluestack-ui components across all 4 existing screens. Keep visual appearance identical — same layout, colors, spacing. No new features.

## Packages to install

```
bun add @gluestack-ui/button
bun add @gluestack-ui/input
bun add @gluestack-ui/form-control
bun add @gluestack-ui/text
bun add @gluestack-ui/heading
bun add @gluestack-ui/box
bun add @gluestack-ui/spinner
bun add @gluestack-ui/vstack
```

Each ships its own TypeScript types and tailwind-compatible classes.

## Component mapping

| RN Primitive | Gluestack Replacement | Package |
|---|---|---|
| `View` (container) | `Box` | `@gluestack-ui/box` |
| `View` (flex column) | `VStack` | `@gluestack-ui/vstack` |
| `Text` (body) | `Text` | `@gluestack-ui/text` |
| `Text` (title) | `Heading` | `@gluestack-ui/heading` |
| `TouchableOpacity` | `Button` + `ButtonText` | `@gluestack-ui/button` |
| `TextInput` | `Input` + `InputField` | `@gluestack-ui/input` |
| label/error wrappers | `FormControl` + family | `@gluestack-ui/form-control` |
| `ActivityIndicator` | `Spinner` | `@gluestack-ui/spinner` |

## Screen refactors

### `app/index.tsx` — Landing page

- `VStack` container replacing `View className="flex-1 ..."`
- `Heading` for "Todo App" title, `Text` for subtitle
- 2 `Button` components (Login primary, Sign Up `variant="outline"`)
- Keep `router.push` in `onPress`

### `app/login.tsx` — Login form

- `Box` container replacing root `View`
- `FormControl` wrapping each `Input`
- `Input` + `InputField` for email/password
- `Button` + `ButtonText` for Sign In
- `Text` for error message and "Don't have an account?" prompt

### `app/signup.tsx` — Registration form

- Same pattern as login with 3 fields (name, email, password)
- `Button` + `ButtonText` for Create Account

### `app/todos.tsx` — Todos list (placeholder)

- `Box` + `SafeAreaView` container
- `Heading` for "Your Todos"
- `Spinner` replacing `ActivityIndicator` during loading
- `Button` + `ButtonText` for Sign Out (`variant="outline"` with error-500)

## Styling approach

All gluestack components accept `className` prop for Tailwind utilities. Keep existing color tokens (`bg-background-0`, `text-typography-950`, `bg-primary-500`, etc.) exactly the same. Gluestack component variants (`variant`, `size`) supplement — not replace — Tailwind className overrides.

## What stays the same

- `SafeAreaView` from `react-native-safe-area-context` (no gluestack equivalent)
- `Stack.Screen` from expo-router (navigation config, not UI)
- `router.push` / `router.replace` calls
- All TanStack Query and Zustand hooks
- Firebase auth flow

## What stays removed

- `import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"` — replaced by gluestack imports
- `SafeAreaView` is imported from `react-native-safe-area-context`, not `react-native` — kept as-is

## Verification

1. `bun run lint` passes
2. All 4 screens render at same breakpoints with identical visual layout
3. No regressions in auth flow routing
