import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
import { useCategories } from "@/hooks/useCategories";
import { useAddComment } from "@/hooks/useComments";
import { useDeleteTodo, useTodo, useUpdateTodo } from "@/hooks/useTodos";
import type { TodoPriority } from "@/types/todo";
import { resolveColor } from "@/utils/colors";
import { priorityColor, priorityLabel } from "@/utils/todo";

const priorities: TodoPriority[] = ["LOW", "MEDIUM", "HIGH"];

export default function TodoDetailScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: todo, isLoading, isError, error } = useTodo(id);
  const { data: allCategories } = useCategories();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { mutateAsync: deleteTodo, isPending: isDeleting } = useDeleteTodo();
  const { mutate: addComment, isPending: isAddingComment } = useAddComment(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [commentText, setCommentText] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (todo && !initialized) {
      setTitle(todo.title);
      setDescription(todo.description);
      setPriority(todo.priority);
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
      setSelectedCategoryIds(todo.categories.map((c) => c.id));
      setInitialized(true);
    }
  }, [todo, initialized]);

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId],
    );
  };

  const handleSave = () => {
    const dto = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate
        ? dueDate.toISOString().replace(/\.\d{3}Z$/, "")
        : undefined,
      categories: selectedCategoryIds,
    };
    updateTodo(
      { id, dto },
      {
        onSuccess: () => {
          toast.show({
            duration: 1500,
            placement: "top",
            render: () => (
              <Toast action="success" variant="solid">
                <ToastTitle>Todo saved</ToastTitle>
              </Toast>
            ),
          });
        },
      },
    );
  };

  const handleDelete = () => {
    Alert.alert("Delete Todo", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          router.back();
          deleteTodo(id)
            .then(() => {
              toast.show({
                duration: 3000,
                placement: "top",
                render: () => (
                  <Toast action="success" variant="solid">
                    <ToastTitle>Todo deleted</ToastTitle>
                  </Toast>
                ),
              });
            })
            .catch(() => {});
        },
      },
    ]);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(
      { content: commentText.trim() },
      { onSuccess: () => setCommentText("") },
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0 justify-center items-center">
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  if (isError || !todo) {
    return (
      <SafeAreaView className="flex-1 bg-background-0 justify-center items-center px-6">
        <Text className="text-typography-500 text-center">
          {error?.message || "Todo not found"}
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
          title: "Edit Todo",
          headerBackTitle: "Back",
        }}
      />

      <Box className="flex-row items-center gap-3 px-6 pb-3 border-b border-outline-200">
        <Pressable onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="arrow-back" size={24} color="rgb(51 51 51)" />
        </Pressable>
        <Heading size="xl" className="font-bold text-typography-950 flex-1">
          Edit Todo
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
            <Box className="flex-row items-center gap-3">
              <Pressable
                onPress={() =>
                  updateTodo(
                    { id, dto: { completed: !todo.completed } },
                    {
                      onSuccess: () => {
                        toast.show({
                          duration: 2000,
                          placement: "top",
                          render: () => (
                            <Toast action="success" variant="solid">
                              <ToastTitle>
                                {todo.completed
                                  ? "Todo reopened"
                                  : "Todo completed"}
                              </ToastTitle>
                            </Toast>
                          ),
                        });
                      },
                    },
                  )
                }
                className={`w-6 h-6 rounded border-2 items-center justify-center ${
                  todo.completed
                    ? "bg-green-500 border-green-500"
                    : "border-outline-300 bg-background-0"
                }`}
              />
              <Input variant="outline" size="md" className="flex-1">
                <InputField
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                />
              </Input>
            </Box>

            <Input variant="outline" size="md">
              <InputField
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </Input>

            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="border border-outline-200 rounded px-3 py-2.5"
            >
              <Text
                className={
                  dueDate ? "text-typography-900" : "text-typography-500"
                }
              >
                {dueDate
                  ? dueDate.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Pick due date"}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate ?? new Date()}
                mode="date"
                display="default"
                onChange={(_event: DateTimePickerEvent, date?: Date) => {
                  setShowDatePicker(false);
                  if (date) setDueDate(date);
                }}
              />
            )}

            <Text size="sm" className="text-typography-500 font-medium">
              Priority
            </Text>
            <Box className="flex-row gap-2">
              {priorities.map((p) => (
                <Pressable
                  key={p}
                  className={`flex-1 py-2.5 rounded-lg border items-center flex-row justify-center gap-1.5 ${
                    priority === p
                      ? "border-primary-500 bg-primary-50"
                      : "border-outline-200"
                  }`}
                  onPress={() => setPriority(p)}
                >
                  <Box
                    className={`w-2.5 h-2.5 rounded-full ${priorityColor[p]}`}
                  />
                  <Text
                    size="sm"
                    className={
                      priority === p
                        ? "text-primary-700 font-semibold"
                        : "text-typography-500"
                    }
                  >
                    {priorityLabel[p]}
                  </Text>
                </Pressable>
              ))}
            </Box>

            {allCategories && allCategories.length > 0 && (
              <>
                <Text size="sm" className="text-typography-500 font-medium">
                  Categories
                </Text>
                <Box className="flex-row flex-wrap gap-2">
                  {allCategories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <Pressable
                        key={cat.id}
                        className={`flex-row items-center gap-2 px-3 py-2 rounded-lg border ${
                          isSelected
                            ? "border-transparent"
                            : "border-outline-200"
                        }`}
                        style={
                          isSelected
                            ? { backgroundColor: resolveColor(cat.color) }
                            : undefined
                        }
                        onPress={() => toggleCategory(cat.id)}
                      >
                        <Box
                          className={`w-3.5 h-3.5 rounded border-2 items-center justify-center ${
                            isSelected
                              ? "bg-white/30 border-white"
                              : "border-outline-300"
                          }`}
                        >
                          {isSelected && (
                            <Text className="text-white text-[10px] font-bold">
                              ✓
                            </Text>
                          )}
                        </Box>
                        <Text
                          size="sm"
                          className={
                            isSelected
                              ? "text-white font-medium"
                              : "text-typography-700"
                          }
                        >
                          {cat.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </Box>
              </>
            )}

            <Box className="border-t border-outline-200 pt-4 mt-2">
              <Heading size="md" className="mb-3">
                Comments
              </Heading>

              {todo.comments.length === 0 ? (
                <Text size="sm" className="text-typography-400 mb-3">
                  No comments yet
                </Text>
              ) : (
                <VStack className="gap-2 mb-3">
                  {todo.comments.map((c) => (
                    <Box
                      key={c.id}
                      className="bg-background-50 rounded-lg px-3 py-2"
                    >
                      <Text size="sm" className="text-typography-900">
                        {c.content}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )}

              <Box className="flex-row gap-2">
                <Input variant="outline" size="md" className="flex-1">
                  <InputField
                    placeholder="Add a comment"
                    value={commentText}
                    onChangeText={setCommentText}
                  />
                </Input>
                <Button
                  size="sm"
                  onPress={handleAddComment}
                  isDisabled={!commentText.trim() || isAddingComment}
                >
                  <ButtonText>Send</ButtonText>
                </Button>
              </Box>
            </Box>

            <Box className="flex-row gap-3 pt-4">
              <Button
                action="positive"
                variant="solid"
                className="flex-1"
                isDisabled={!title.trim() || isUpdating}
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
