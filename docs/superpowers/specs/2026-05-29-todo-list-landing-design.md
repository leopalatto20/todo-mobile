# Todo List Landing Page Design

**Date:** 2026-05-29
**Status:** Approved

## Overview

Render the authenticated todo list as the main screen (`app/(tabs)/todos.tsx`) using `useTodos` hook from TanStack Query. Simple card-based list with loading skeletons, empty state, and error handling.

## Architecture

Single screen component using existing data flow:

```
TodoScreen → useTodos() → todoService.getAll() → GET /todos
```

Auth guard remains: redirect to `/` if no user/token.

## Component States

### Loading
Two loading layers:
- **Auth loading** (initial Firebase check): keep current centered `Spinner` or use full-screen skeleton
- **Todos loading** (TanStack Query): 3 skeleton cards using gluestack-ui `Skeleton` + `SkeletonText`. Each skeleton matches card dimensions (rounded corners, checkbox placeholder, title line, subtitle line).

### Empty
Icon + "No todos yet" centered message when `data` is empty array.

### Error
Error description from query + "Try Again" button that calls `refetch()`.

### Data
Scrollable `FlatList` of todo cards.

## Card Layout

Each card rendered as a `Box` with:
| Element | Component |
|---|---|
| Checkbox | Square tap target (completed toggle — wired later) |
| Title | `Heading`/`Text`, semibold, 15px |
| Due date | `Text`, muted color, calendar icon |
| Priority badge | Colored dot or label (red=HIGH, yellow=MEDIUM, green=LOW) |

Cards have 12px border radius, 14px padding, subtle border, background white.

## Steps

1. Install skeleton: `npx gluestack-ui add skeleton --use-bun`
2. Update `app/(tabs)/todos.tsx`:
   - Import `useTodos` from `@/hooks/useTodos`
   - Import `Skeleton`, `SkeletonText` from `@/components/ui/skeleton`
   - Import `FlatList` from React Native
   - Replace loading state with skeleton cards
   - Add empty state with icon + message
   - Add error state with retry
   - Render todo cards using `FlatList`
   - Format `dueDate` and map priority to color
3. Remove unused imports (`useSignOut`, `Spinner`)

## Out of Scope

- Create/update/delete todo actions
- Swipe gestures
- Pull-to-refresh
- Categories display
- Navigation to detail screen
