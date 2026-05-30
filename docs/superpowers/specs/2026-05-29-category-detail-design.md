# Category Detail Screen

## Files

- **Create**: `app/category/[id].tsx` — detail/edit screen
- **Modify**: `components/category/CategoryCard.tsx` — add `onPress` navigation

## Data

- `useCategory(id)` → `CategoryResponse` (name, description, color) — prefills form
- `useCategoriesWithTodos()` → filter matching category → `item.todos` — display list
- `useUpdateCategory()` → `updateCategory({ id, dto })` — optimistic update
- `useDeleteCategory()` → confirmation dialog → `deleteCategory(id)` → `router.back()`

## Screen layout (`app/category/[id].tsx`)

- **Header**: "Edit Category" via `Stack.Screen`
- **Loading**: centered `Spinner`
- **Error**: message + "Go Back" button
- **Form** (ScrollView):
  - Name input (prefilled)
  - Description input, multiline (prefilled)
  - Color section: label + 10 preset swatches (same `PRESET_COLOR_NAMES` as CreateCategorySheet)
- **Divider**
- **Todos heading**: "Todos in this category"
  - Empty state: "No todos yet"
  - List: compact rows with checkbox icon + title + priority dot — display only (no tap)
- **Action buttons**:
  - Save (disabled when empty name or saving)
  - Delete → `Alert.alert` confirmation → delete + navigate back

## Navigation

- `CategoryCard` gets `router.push(\`/category/${item.id}\`)` on press
- Uses expo-router file-based routing — `app/category/[id].tsx` auto-matches

## Route registration

- No manual config needed — expo-router filesystem routing
- Tab layout unaffected
