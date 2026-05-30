# Search Tab Design

Add a search tab (3rd tab) to the mobile app allowing users to search todos by text query with priority and completion filters.

## API

`GET /todos/search/{search}?completed=&priority=`

- `search` (path) — text query matched against title/description
- `completed` (query, optional) — boolean filter
- `priority` (query, optional) — `LOW | MEDIUM | HIGH`

Returns `TodoResponse[]`.

## Service Layer

Add `search` method to `todoService` in `services/todos.ts`:

```
search(query, filters?) → GET /todos/search/{query} with params {completed, priority}
```

## Hook Layer

Add to `hooks/useTodos.ts`:

- Query key: `["todos", "search", query, filters]`
- `useSearchTodos(query, filters)` — enabled only when query is non-empty
- Debounce (300ms) handled in the screen component via `useEffect` + setTimeout, not in the hook

## Screen

New file `app/(tabs)/search.tsx` — single file, follows existing todos.tsx pattern.

**Layout (top to bottom):**

1. `StatusBar style="dark"`
2. Header row: "Search" heading + no sign-out button
3. Search `Input` with `InputField`, placeholder "Search todos...", autoFocus
4. Filter chips row:
   - Priority: ALL | LOW | MEDIUM | HIGH (pill buttons, mutually exclusive)
   - Completed: ALL | Pending | Done (pill buttons, mutually exclusive)
5. Results: `FlatList` reusing `TodoCard` component + `RefreshControl`
6. Loading: `TodoCardSkeleton` (reused)
7. Empty/error states matching existing patterns

**State:**

- `searchQuery: string` — raw input value
- `debouncedQuery: string` — debounced (300ms) via useEffect, triggers API
- `priority: TodoPriority | null` — null = all priorities
- `completed: boolean | null` — null = all statuses

**Interactions:**

- Typing → debounce (300ms) → API call
- Filter tap → immediate API call (no debounce)
- Clearing search → results cleared

## Tab Registration

Add `search.tsx` as 3rd tab in `app/(tabs)/_layout.tsx`:

- Tab order: Todos → Categories → Search
- Icon: `search-outline` (Ionicons)
- Title: "Search"

## Files Changed

| File                     | Change                                         |
| ------------------------ | ---------------------------------------------- |
| `services/todos.ts`      | Add `search()` method                          |
| `hooks/useTodos.ts`      | Add `useSearchTodos()` hook + search query key |
| `app/(tabs)/search.tsx`  | New — full search screen                       |
| `app/(tabs)/_layout.tsx` | Add search Tabs.Screen                         |

No new components, no new types, no mutations.
