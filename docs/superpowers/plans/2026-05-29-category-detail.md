# Category Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create category detail/edit screen accessible from tapping CategoryCard

**Architecture:** New expo-router route `app/category/[id].tsx` with form (name, description, color swatches) + todos list + save/delete. `CategoryCard` gets `router.push` navigation.

**Tech Stack:** Expo Router, TanStack Query, gluestack-ui, NativeWind

---

### Task 1: Add navigation to CategoryCard

**Files:**
- Modify: `components/category/CategoryCard.tsx`

- [ ] **Add Pressable wrapper with router.push**

Import `Pressable` from react-native and `router` from expo-router. Wrap the existing card content in a `Pressable` that navigates to `/category/${item.id}`:

```tsx
import { router } from "expo-router";

export function CategoryCard({ item }: { item: CategoryWithTodosResponse }) {
  // ... existing variables ...

  return (
    <Pressable onPress={() => router.push(`/category/${item.id}`)}>
      <Box className="bg-white rounded-xl border border-outline-200 mb-3 overflow-hidden">
        {/* ... existing content unchanged ... */}
      </Box>
    </Pressable>
  );
}
```

- [ ] **Verify import**

Ensure `Pressable` is already imported (it was already used indirectly via react-native — check imports at top of file). Add `router` import from `expo-router`.

### Task 2: Create category detail screen

**Files:**
- Create: `app/category/[id].tsx`

- [ ] **Create `app/category/[id].tsx`**

Full screen component:

```tsx
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  useCategoriesWithTodos,
  useCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import type { TodoPriority } from "@/types/todo";
import { PRESET_COLOR_NAMES, resolveColor } from "@/utils/colors";
import { priorityColor } from "@/utils/todo";

const PRESET_COLORS = PRESET_COLOR_NAMES;

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: category, isLoading, isError, error } = useCategory(id);
  const { data: categoriesWithTodos } = useCategoriesWithTodos();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [initialized, setInitialized] = useState(false);

  const categoryWithTodos = categoriesWithTodos?.find((c) => c.id === id);
  const todos = categoryWithTodos?.todos ?? [];

  useEffect(() => {
    if (category && !initialized) {
      setName(category.name);
      setDescription(category.description);
      setColor(category.color);
      setInitialized(true);
    }
  }, [category, initialized]);

  const handleSave = () => {
    updateCategory({
      id,
      dto: {
        name: name.trim(),
        description: description.trim(),
        color,
      },
    });
  };

  const handleDelete = () => {
    Alert.alert("Delete Category", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCategory(id);
          router.back();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-0 justify-center items-center">
        <Spinner size="large" />
      </View>
    );
  }

  if (isError || !category) {
    return (
      <View className="flex-1 bg-background-0 justify-center items-center px-6">
        <Text className="text-typography-500 text-center">
          {error?.message || "Category not found"}
        </Text>
        <Button
          variant="outline"
          className="mt-4"
          onPress={() => router.back()}
        >
          <ButtonText>Go Back</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-0">
      <Stack.Screen
        options={{
          title: "Edit Category",
          headerBackTitle: "Back",
        }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack className="gap-4 pt-6">
            <Input variant="outline" size="md">
              <InputField
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
            </Input>

            <Input variant="outline" size="md">
              <InputField
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </Input>

            <Text size="sm" className="text-typography-500 font-medium">
              Color
            </Text>
            <Box className="flex-row flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <Pressable
                  key={c}
                  className={`w-10 h-10 rounded-lg items-center justify-center ${
                    color === c
                      ? "border-2 border-primary-500"
                      : "border-2 border-transparent"
                  }`}
                  style={{ backgroundColor: resolveColor(c) }}
                  onPress={() => setColor(c)}
                >
                  {color === c && (
                    <Text className="text-white text-lg font-bold">✓</Text>
                  )}
                </Pressable>
              ))}
            </Box>

            <Box className="border-t border-outline-200 pt-4 mt-2">
              <Heading size="md" className="mb-3">
                Todos in this category
              </Heading>

              {todos.length === 0 ? (
                <Text size="sm" className="text-typography-400 mb-3">
                  No todos yet
                </Text>
              ) : (
                <VStack className="gap-2 mb-3">
                  {todos.map((t) => (
                    <Box
                      key={t.id}
                      className="bg-background-50 rounded-lg px-3 py-2.5 flex-row items-center gap-3"
                    >
                      <Box
                        className={`w-5 h-5 rounded border-2 items-center justify-center ${
                          t.completed
                            ? "bg-green-500 border-green-500"
                            : "border-outline-300"
                        }`}
                      >
                        {t.completed && (
                          <Text className="text-white text-[9px] font-bold">
                            ✓
                          </Text>
                        )}
                      </Box>
                      <Text
                        size="sm"
                        className={`flex-1 ${
                          t.completed
                            ? "text-typography-400 line-through"
                            : "text-typography-900"
                        }`}
                      >
                        {t.title}
                      </Text>
                      <Box
                        className={`w-2.5 h-2.5 rounded-full ${
                          priorityColor[t.priority as TodoPriority]
                        }`}
                      />
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>

            <Box className="flex-row gap-3 pt-4">
              <Button
                action="positive"
                variant="solid"
                className="flex-1"
                isDisabled={!name.trim() || isUpdating}
                onPress={handleSave}
              >
                <ButtonText>
                  {isUpdating ? "Saving\u2026" : "Save"}
                </ButtonText>
              </Button>
              <Button
                action="negative"
                variant="outline"
                className="flex-1"
                isDisabled={isDeleting}
                onPress={handleDelete}
              >
                <ButtonText>
                  {isDeleting ? "Deleting\u2026" : "Delete"}
                </ButtonText>
              </Button>
            </Box>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
```

- [ ] **Verify the route works**

```bash
npx expo start --ios
```

Navigate from Categories tab → tap a category card → verify the detail screen loads with prefilled form, color swatches, and todos list. Save and Delete should work.
