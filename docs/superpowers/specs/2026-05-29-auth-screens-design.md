# Auth Screens Design

## Overview

Add three screens to the existing Expo Router app: Home, Login, and Signup. Auth services, store, and hooks already exist — this spec covers only the UI layer and routing. A placeholder `/todos` screen gives authenticated users a landing point.

## Routes

```
app/
  _layout.tsx   # Root stack (existing, unchanged)
  index.tsx     # Home — public landing
  login.tsx     # Email/password form
  signup.tsx    # Name/email/password form
  todos.tsx     # After-auth placeholder
```

All screens are flat stack routes under the existing root `_layout.tsx`. No tabs or nested layouts.

## Home (`/`)

- Full dark background (`StyleSheet`)
- Vertically centered content via flexbox
- App name "Todo App" — large bold white text (fontSize ~32)
- Tagline: "Stay organized, get things done" — subdued gray text below
- 32px spacer
- **Login** button: full-width, filled, accent color (`#4F8EF7` or similar blue), white text, rounded
- 12px gap
- **Sign Up** button: full-width, outlined (border with same accent), accent text, rounded
- No cards, no icons, no nav header/back button visible

## Login (`/login`)

- Stack screen with `options={{ title: "Log In" }}` (gives a back button via stack header)
- Form content:
  - **Email** — `TextInput`, keyboard type `email-address`, autoCapitalize "none", placeholder
  - **Password** — `TextInput`, secureTextEntry, placeholder
  - **Sign In** button — filled primary, disabled while loading
- Error state: inline red text below button when mutation fails
- Footer: "Don't have an account? Sign up" — `router.push("/signup")`
- On success: `router.replace("/todos")`

Mutation: calls `useSignIn` from `@/hooks/useAuth`.

## Signup (`/signup`)

- Stack screen with `options={{ title: "Sign Up" }}`
- Form content:
  - **Name** — `TextInput`, placeholder
  - **Email** — `TextInput`, keyboard type `email-address`, autoCapitalize "none"
  - **Password** — `TextInput`, secureTextEntry
  - **Create Account** button — filled primary, disabled while loading
- Error state: inline red text below button
- Footer: "Already have an account? Log in" — `router.push("/login")`
- On success: `router.replace("/todos")`

Mutation: calls `useRegister` from `@/hooks/useAuth`.

## Placeholder (`/todos`)

- Title: "Your Todos"
- Body: "Todo list coming soon"
- **Sign Out** button: calls `useSignOut` mutation, then `router.replace("/")`
- Auth gate: on mount, if `useAuthStore.user` is null, redirect to `"/"`

## Styling

- Dark background: `#0f0f0f` or similar near-black
- Card/surface: semi-transparent white (`rgba(255,255,255,0.05)`) for subtle separation
- Text: white primary, `#a0a0a0` secondary
- Accent: `#4F8EF7` (blue)
- Error: `#ff4444`
- Inputs: dark fill (`#1c1c1e`), white text, rounded borders
- Padding: 24px horizontal
- All via `React Native StyleSheet` — no Tailwind, no Gluestack components beyond provider

## Data Flow

```
Screen → useSignIn / useRegister / useSignOut (TanStack Query mutation)
       → useAuthStore methods (Zustand)
       → Firebase Auth SDK
       → Axios interceptor attaches token
```

## Files to Create

| File | Purpose |
|---|---|
| `app/login.tsx` | Login form screen |
| `app/signup.tsx` | Signup form screen |
| `app/todos.tsx` | After-auth placeholder |

## Files to Modify

| File | Change |
|---|---|
| `app/index.tsx` | Replace placeholder with home screen design |
