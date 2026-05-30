import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
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

export default function CategoryDetailScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: category, isLoading, isError, error } = useCategory(id);
  const { data: categoriesWithTodos } = useCategoriesWithTodos();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLOR_NAMES[0]);
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
    updateCategory(
      {
        id,
        dto: {
          name: name.trim(),
          description: description.trim(),
          color,
        },
      },
      {
        onSuccess: () => {
          toast.show({
            duration: 1500,
            placement: "top",
            render: () => (
              <Toast action="success" variant="solid">
                <ToastTitle>Category saved</ToastTitle>
              </Toast>
            ),
          });
        },
      },
    );
  };

  const handleDelete = () => {
    Alert.alert("Delete Category", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          router.back();
          deleteCategory(id)
            .then(() => {
              toast.show({
                duration: 3000,
                placement: "top",
                render: () => (
                  <Toast action="success" variant="solid">
                    <ToastTitle>Category deleted</ToastTitle>
                  </Toast>
                ),
              });
            })
            .catch(() => {});
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0 justify-center items-center">
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  if (isError || !category) {
    return (
      <SafeAreaView className="flex-1 bg-background-0 justify-center items-center px-6">
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen
        options={{
          title: "Edit Category",
          headerBackTitle: "Back",
        }}
      />

      <Box className="flex-row items-center gap-3 px-6 pb-3 border-b border-outline-200">
        <Pressable onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="arrow-back" size={24} color="rgb(51 51 51)" />
        </Pressable>
        <Heading size="xl" className="font-bold text-typography-950 flex-1">
          Edit Category
        </Heading>
      </Box>

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
              {PRESET_COLOR_NAMES.map((c) => (
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
                <ButtonText>{isUpdating ? "Saving\u2026" : "Save"}</ButtonText>
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
    </SafeAreaView>
  );
}
