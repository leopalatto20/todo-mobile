# Frontend Architecture Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold frontend architecture — services, hooks, stores, types, utils — for an Expo todo app with REST API + Firebase Auth.

**Architecture:** Type-based layout: `types/` (manual interfaces from OpenAPI), `services/` (Axios CRUD functions), `stores/` (Zustand auth with persist), `hooks/` (TanStack Query wrappers), `utils/`. Data flows: Screen → Hook → Service → API. Auth token flows Firebase → Zustand → Axios interceptor.

**Tech Stack:** Expo SDK 54, React Native 0.81.5, TypeScript strict, Axios, TanStack Query, Zustand, Firebase JS SDK, Bun.

---

### Task 1: Install dependency + create directory structure

**Files:**

- Create: `src/types/`, `src/services/`, `src/hooks/`, `src/stores/`, `src/utils/`, `src/config/` (directories)

- [ ] **Step 1: Install AsyncStorage**

Run: `bun add @react-native-async-storage/async-storage`

- [ ] **Step 2: Create directory scaffolding**

Run:

```bash
mkdir -p src/types src/services src/hooks src/stores src/utils src/config
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "chore: scaffold src directory structure"
```

---

### Task 2: Create type files

**Files:**

- Create: `src/types/todo.ts`
- Create: `src/types/category.ts`
- Create: `src/types/user.ts`
- Create: `src/types/comment.ts`

- [ ] **Step 1: Create `src/types/todo.ts`**

````ts
import type { CategoryResponse } from "./category";
import type { CommentResponse } from "./comment";

export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export type TodoResponse = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string;
  categories: CategoryResponse[];
};

- [ ] **Step 2: Create `src/types/category.ts`**

```ts
export type CategoryResponse = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type CategoryWithTodosResponse = CategoryResponse & {
  todos: TodoResponse[];
};

export type CreateCategoryDto = {
  name: string;
  description: string;
  color: string;
};
````

- [ ] **Step 3: Create `src/types/user.ts`**

```ts
export type User = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  providerUid: string;
  role: string;
};

export type UserProfileResponse = {
  id: string;
  name: string;
  email: string;
  providerUid: string;
  role: string;
};

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role?: string;
};
```

- [ ] **Step 4: Create `src/types/comment.ts`**

```ts
export type CommentResponse = {
  id: string;
  content: string;
};

export type AddCommentDto = {
  content: string;
};
```

- [ ] **Step 5: Create `src/types/index.ts`**

```ts
export * from "./todo";
export * from "./category";
export * from "./user";
export * from "./comment";
```

- [ ] **Step 6: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/types/ && git commit -m "feat: add manual API types from OpenAPI spec"
```

---

### Task 3: Create Firebase config

**Files:**

- Create: `src/config/firebase.ts`

- [ ] **Step 1: Create `src/config/firebase.ts`**

```ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

- [ ] **Step 2: Create `.env` placeholder**

Run: `touch .env` (add to `.gitignore` if not already there — `.env*.local` is already ignored).

- [ ] **Step 3: Commit**

```bash
git add src/config/ && git commit -m "feat: add Firebase config with AsyncStorage persistence"
```

---

### Task 4: Create Axios instance with auth interceptor

**Files:**

- Create: `src/services/api.ts`

- [ ] **Step 1: Create `src/services/api.ts`**

```ts
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().signOut();
    }
    return Promise.reject(error);
  },
);

export default api;
```

- [ ] **Step 2: Commit**

```bash
git add src/services/api.ts && git commit -m "feat: add Axios instance with Firebase token interceptor"
```

---

### Task 5: Create service files

**Files:**

- Create: `src/services/todos.ts`
- Create: `src/services/categories.ts`
- Create: `src/services/users.ts`

- [ ] **Step 1: Create `src/services/todos.ts`**

```ts
import api from "./api";
import type {
  TodoResponse,
  TodoDetailResponse,
  CreateTodoDto,
  UpdateTodoDto,
} from "@/types/todo";

export const todoService = {
  getAll: () => api.get<TodoResponse[]>("/todos").then((r) => r.data),

  getById: (id: string) =>
    api.get<TodoDetailResponse>(`/todos/${id}`).then((r) => r.data),

  create: (dto: CreateTodoDto) =>
    api.post<TodoResponse>("/todos", dto).then((r) => r.data),

  update: (id: string, dto: UpdateTodoDto) =>
    api.patch<TodoResponse>(`/todos/${id}`, dto).then((r) => r.data),

  delete: (id: string) => api.delete(`/todos/${id}`),
};
```

- [ ] **Step 2: Create `src/services/categories.ts`**

```ts
import api from "./api";
import type {
  CategoryResponse,
  CategoryWithTodosResponse,
  CreateCategoryDto,
} from "@/types/category";

export const categoryService = {
  getAll: () => api.get<CategoryResponse>("/categories").then((r) => r.data),

  getWithTodos: () =>
    api
      .get<CategoryWithTodosResponse>("/categories/with-todos")
      .then((r) => r.data),

  create: (dto: CreateCategoryDto) =>
    api.post<CategoryResponse>("/categories", dto).then((r) => r.data),
};
```

Note: `/categories` GET returns a single object in the OpenAPI spec (`CategoryResponse`), not an array — may need adjusting if the actual response is an array. Check at integration time.

- [ ] **Step 3: Create `src/services/users.ts`**

```ts
import api from "./api";
import type { User, CreateUserDto, UserProfileResponse } from "@/types/user";

export const userService = {
  register: (dto: CreateUserDto) =>
    api.post<User>("/users", dto).then((r) => r.data),

  getProfile: () =>
    api.get<UserProfileResponse>("/users/me").then((r) => r.data),
};
```

- [ ] **Step 4: Commit**

```bash
git add src/services/ && git commit -m "feat: add todo, category, user API services"
```

---

### Task 6: Create Zustand auth store

**Files:**

- Create: `src/stores/authStore.ts`

- [ ] **Step 1: Create `src/stores/authStore.ts`**

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      firebaseUser: null,

      signIn: async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const token = await credential.user.getIdToken();
        set({
          firebaseUser: credential.user as unknown as FirebaseUser,
          token,
        });
      },

      signOut: async () => {
        await firebaseSignOut(auth);
        set({ user: null, token: null, firebaseUser: null });
      },

      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

// Listen for Firebase auth state changes
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    useAuthStore.setState({ firebaseUser, token, isLoading: false });
  } else {
    useAuthStore.setState({
      firebaseUser: null,
      user: null,
      token: null,
      isLoading: false,
    });
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/ && git commit -m "feat: add Zustand auth store with Firebase + persist"
```

---

### Task 7: Wire TanStack Query provider in root layout

**Files:**

- Modify: `app/_layout.tsx`

- [ ] **Step 1: Update `app/_layout.tsx` to wrap with QueryClientProvider**

```tsx
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx && git commit -m "feat: add TanStack Query provider to root layout"
```

---

### Task 8: Create hook files

**Files:**

- Create: `src/hooks/useTodos.ts`
- Create: `src/hooks/useCategories.ts`
- Create: `src/hooks/useAuth.ts`

- [ ] **Step 1: Create `src/hooks/useTodos.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "@/services/todos";
import type { CreateTodoDto, UpdateTodoDto } from "@/types/todo";

const todoKeys = {
  all: ["todos"] as const,
  detail: (id: string) => ["todos", id] as const,
};

export function useTodos() {
  return useQuery({ queryKey: todoKeys.all, queryFn: todoService.getAll });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTodoDto) => todoService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTodoDto }) =>
      todoService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
```

- [ ] **Step 2: Create `src/hooks/useCategories.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categories";
import type { CreateCategoryDto } from "@/types/category";

const categoryKeys = {
  all: ["categories"] as const,
  withTodos: ["categories", "with-todos"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoryService.getAll,
  });
}

export function useCategoriesWithTodos() {
  return useQuery({
    queryKey: categoryKeys.withTodos,
    queryFn: categoryService.getWithTodos,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => categoryService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}
```

- [ ] **Step 3: Create `src/hooks/useAuth.ts`**

```ts
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/users";
import type { CreateUserDto } from "@/types/user";

export function useSignIn() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });
}

export function useSignOut() {
  const signOut = useAuthStore((s) => s.signOut);
  return useMutation({
    mutationFn: () => signOut(),
  });
}

export function useRegister() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: CreateUserDto & { password: string }) => {
      await userService.register({ name, email, password });
      await signIn(email, password);
    },
  });
}
```

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/hooks/ && git commit -m "feat: add TanStack Query hooks for todos, categories, auth"
```

---

### Task 9: Create utility functions

**Files:**

- Create: `src/utils/date.ts`

- [ ] **Step 1: Create `src/utils/date.ts`**

```ts
export function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function isOverdue(dateString: string): boolean {
  return new Date(dateString) < new Date();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/ && git commit -m "feat: add date utility helpers"
```

---

### Task 10: Final verification

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors

- [ ] **Step 3: Verify the structure**

Run: `ls -R src/`
Expected output:

```
src/
  config/
    firebase.ts
  hooks/
    useAuth.ts
    useCategories.ts
    useTodos.ts
  services/
    api.ts
    categories.ts
    todos.ts
    users.ts
  stores/
    authStore.ts
  types/
    category.ts
    comment.ts
    index.ts
    todo.ts
    user.ts
  utils/
    date.ts
```
