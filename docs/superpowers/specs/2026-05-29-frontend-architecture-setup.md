# Frontend Architecture Setup

**Date:** 2026-05-29
**Project:** todo-mobile (Expo SDK 54, React Native, TypeScript)
**Status:** Approved — ready for implementation

## Stack

| Concern       | Choice                                                  |
| ------------- | ------------------------------------------------------- |
| HTTP client   | Axios                                                   |
| Server state  | TanStack Query                                          |
| Auth state    | Zustand + persist (AsyncStorage)                        |
| Auth provider | Firebase Auth (email/password)                          |
| Organization  | Type-based (services/, hooks/, types/, stores/, utils/) |
| Types         | Manually written (no codegen)                           |

## Directory structure

```
src/
  config/
    firebase.ts           # Firebase app init
  types/
    todo.ts               # TodoResponse, TodoDetailResponse, CreateTodoDto, UpdateTodoDto
    category.ts           # CategoryResponse, CategoryWithTodosResponse, CreateCategoryDto
    user.ts               # User, UserProfileResponse, CreateUserDto
    comment.ts            # CommentResponse, AddCommentDto
  services/
    api.ts                # Axios instance + Firebase token interceptor
    todos.ts              # CRUD functions for /todos
    categories.ts         # CRUD functions for /categories
    users.ts              # register, getProfile
  hooks/
    useTodos.ts           # TanStack Query: useTodos, useTodo, useCreateTodo, useUpdateTodo, useDeleteTodo
    useCategories.ts      # TanStack Query: useCategories, useCategoriesWithTodos, useCreateCategory
    useAuth.ts            # login, logout, register — bridges Firebase + Zustand store
  stores/
    authStore.ts          # Zustand store with persist middleware
  utils/
    date.ts               # formatDueDate, isOverdue, etc.
```

## Data flow

### Server data (todos, categories)

```
Screen → Hook (TanStack Query) → Service (Axios) → REST API
                                     ↕
                            Firebase token (Axios interceptor)
```

- Services return plain async functions, no React dependency.
- Hooks own caching, loading/error states, and mutation invalidation.
- Screens import hooks only, never services directly.

### Auth

```
Screen → useAuth hook → Firebase SDK (auth/signIn, auth/signOut)
                         ↓
                    Zustand store (persisted token)
                         ↓
                    Axios interceptor (Attach Bearer token to every request)
```

- `useAuth` hook is the single API for screens.
- Zustand store is the single source of truth for auth state.
- `useAuthStore.getState().token` is used in Axios interceptors (outside React tree).

## Services layer

### `src/services/api.ts`

- Creates Axios instance with `baseURL` from `EXPO_PUBLIC_API_URL` env var.
- Request interceptor reads `token` from `useAuthStore.getState()` and sets `Authorization: Bearer <token>`.
- Response interceptor handles 401 → trigger sign-out.

### Entity services

Each service file exports a plain object with async methods:

- `todoService.getAll()`, `.getById(id)`, `.create(dto)`, `.update(id, dto)`, `.delete(id)`
- `categoryService.getAll()`, `.getWithTodos()`, `.create(dto)`
- `userService.register(dto)`, `.getProfile()`

All methods typed with manual interfaces from `@/types/`.

## Hooks layer

### `src/hooks/useTodos.ts`

- `useTodos()` → `useQuery({ queryKey: ['todos'], queryFn: ... })`
- `useTodo(id)` → `useQuery({ queryKey: ['todos', id], queryFn: ... })`
- `useCreateTodo()` → `useMutation` with `onSuccess: invalidate ['todos']`
- `useUpdateTodo()` → `useMutation` with `onSuccess: invalidate ['todos']`
- `useDeleteTodo()` → `useMutation` with `onSuccess: invalidate ['todos']`

### `src/hooks/useCategories.ts`

- `useCategories()`, `useCategoriesWithTodos()`, `useCreateCategory()`

### `src/hooks/useAuth.ts`

- `useSignIn()` → Firebase `signInWithEmailAndPassword` → set Zustand store
- `useSignOut()` → Firebase `signOut` → clear Zustand store
- `useRegister()` → `userService.register()` → then sign in
- Token cached in Zustand persist, loaded on app init via `onAuthStateChanged`

## Stores

### `src/stores/authStore.ts`

Persisted fields: `user`, `token`
Ephemeral fields: `isLoading`
Not persisted: `isLoading` (re-hydrated on mount)

## Utilities

### `src/utils/date.ts`

- `formatDueDate(date: string): string`
- `isOverdue(date: string): boolean`
- Priority display helper (LOW/MEDIUM/HIGH → color/label)

## Dependencies to install

- `axios`
- `@tanstack/react-query`
- `firebase` (JS SDK — works without dev build in Expo managed workflow)
- `@react-native-async-storage/async-storage` (if not already present)
- `zustand`

## Phased delivery

1. Create directory structure + type files
2. `api.ts` Axios instance with interceptor
3. Service files (todos, categories, users)
4. Zustand auth store + Firebase config
5. TanStack Query provider setup in root layout
6. Hook files (useTodos, useCategories, useAuth)
7. Utils
