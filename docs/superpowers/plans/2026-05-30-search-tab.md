# Search Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add third tab with live search across todos

**Architecture:** New `search()` method on existing `todoService`, new `useSearchTodos()` hook, new `search.tsx` screen in `app/(tabs)/`, register in tab layout. Reuses `TodoCard`, `TodoCardSkeleton`, `Spinner`. Debounce (300ms) in screen component.

**Tech Stack:** Expo Router (file-based tabs), TanStack Query v5, gluestack UI, NativeWind

---

### Task 1: Add search method to todoService

**Files:**
- Modify: `services/todos.ts` (add `search` method)

- [ ] **Step 1: Add search method**

```ts
// After delete, before closing brace of todoService
search: (
  query: string,
  filters?: { completed?: boolean; priority?: TodoPriority },
) =>
  api
    .get<TodoResponse[]>(`/todos/search/${encodeURIComponent(query)}`, {
      params: filters,
    })
    .then((r) => r.data),
```

Import `TodoPriority` and `TodoResponse` from `@/types/todo` (already imported).

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors in `services/todos.ts`

- [ ] **Step 3: Commit**

```bash
git add services/todos.ts
git commit -m "feat: add search method to todoService"
```

### Task 2: Add useSearchTodos hook

**Files:**
- Modify: `hooks/useTodos.ts`

- [ ] **Step 1: Add search query key and hook**

After existing `todoKeys` definition (before `useTodos`):
```ts
// In todoKeys:
search: (
    query: string,
    filters?: { completed?: boolean; priority?: TodoPriority },
  ) => ["todos", "search", query, filters] as const,
```

After `useDeleteTodo` (at end of file):
```ts
export function useSearchTodos(
  query: string,
  filters?: { completed?: boolean; priority?: TodoPriority },
) {
  return useQuery({
    queryKey: todoKeys.search(query, filters),
    queryFn: () => todoService.search(query, filters),
    enabled: query.trim().length > 0,
  });
}
```

Import `TodoPriority` at top (add to existing import from `@/types/todo`).

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors in `hooks/useTodos.ts`

- [ ] **Step 3: Commit**

```bash
git add hooks/useTodos.ts
git commit -m "feat: add useSearchTodos hook with search query key"
```

### Task 3: Create search screen

**Files:**
- Create: `app/(tabs)/search.tsx`

- [ ] **Step 1: Create search screen**

```tsx
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TodoCard } from "@/components/todo/TodoCard";
import { TodoCardSkeleton } from "@/components/todo/TodoCardSkeleton";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSearchTodos } from "@/hooks/useTodos";
import type { TodoPriority } from "@/types/todo";

const priorities: (TodoPriority | null)[] = [null, "LOW", "MEDIUM", "HIGH"];
const priorityLabel: Record<string, string> = {
  ALL: "All",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const completionOptions: (boolean | null)[] = [null, false, true];
const completionLabel: Record<string, string> = {
  null: "All",
  false: "Pending",
  true: "Done",
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [priority, setPriority] = useState<TodoPriority | null>(null);
  const [completed, setCompleted] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchQuery]);

  const filters =
    priority !== null || completed !== null
      ? {
          ...(priority !== null && { priority }),
          ...(completed !== null && { completed }),
        }
      : undefined;

  const { data, isLoading, isError, error, refetch } = useSearchTodos(
    debouncedQuery,
    filters,
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <StatusBar style="dark" />

      <Box className="flex-1 px-6 relative">
        <Box className="flex-row justify-between items-center pb-2">
          <Heading size="xl" className="font-bold text-typography-950">
            Search
          </Heading>
        </Box>

        <Input variant="outline" size="md" className="mb-4">
          <InputField
            placeholder="Search todos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
        </Input>

        <VStack className="gap-3 mb-4">
          <Box className="flex-row gap-2">
            {priorities.map((p) => {
              const isActive = priority === p;
              const label = p === null ? "All" : priorityLabel[p];
              return (
                <Pressable
                  key={String(p)}
                  className={`px-3 py-1.5 rounded-full border ${
                    isActive
                      ? "bg-primary-500 border-primary-500"
                      : "border-outline-200"
                  }`}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    size="sm"
                    className={
                      isActive ? "text-white" : "text-typography-600"
                    }
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </Box>

          <Box className="flex-row gap-2">
            {completionOptions.map((c) => {
              const isActive = completed === c;
              const label = c === null ? "All" : c ? "Done" : "Pending";
              return (
                <Pressable
                  key={String(c)}
                  className={`px-3 py-1.5 rounded-full border ${
                    isActive
                      ? "bg-primary-500 border-primary-500"
                      : "border-outline-200"
                  }`}
                  onPress={() => setCompleted(c)}
                >
                  <Text
                    size="sm"
                    className={
                      isActive ? "text-white" : "text-typography-600"
                    }
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </Box>
        </VStack>

        {debouncedQuery.trim().length === 0 ? (
          <VStack className="flex-1 justify-center items-center gap-2">
            <Ionicons
              name="search-outline"
              size={48}
              color="rgb(163 163 163)"
            />
            <Text className="text-typography-400">
              Type to search todos
            </Text>
          </VStack>
        ) : isLoading ? (
          <VStack className="pt-2">
            <TodoCardSkeleton />
            <TodoCardSkeleton />
            <TodoCardSkeleton />
          </VStack>
        ) : isError ? (
          <VStack className="flex-1 justify-center items-center gap-4">
            <Text className="text-typography-500 text-center">
              {error?.message || "Something went wrong"}
            </Text>
            <Pressable onPress={() => refetch()}>
              <Text className="text-primary-500 font-semibold">Retry</Text>
            </Pressable>
          </VStack>
        ) : !data || data.length === 0 ? (
          <VStack className="flex-1 justify-center items-center gap-2">
            <Ionicons
              name="search-outline"
              size={48}
              color="rgb(163 163 163)"
            />
            <Text className="text-typography-400">No results found</Text>
          </VStack>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TodoCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No errors in `app/(tabs)/search.tsx`

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/search.tsx
git commit -m "feat: add search screen with text input, priority and completed filters"
```

### Task 4: Register search tab

**Files:**
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Add search Tabs.Screen**

Add after the `categories` Tabs.Screen:
```tsx
<Tabs.Screen
  name="search"
  options={{
    title: "Search",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="search-outline" size={size} color={color} />
    ),
  }}
/>
```

`Ionicons` already imported at top.

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors in `app/(tabs)/_layout.tsx`

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/_layout.tsx
git commit -m "feat: register search tab with search-outline icon"
```
