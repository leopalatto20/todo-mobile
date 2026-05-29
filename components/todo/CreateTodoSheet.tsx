import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTodo } from "@/hooks/useTodos";
import { priorityColor, priorityLabel } from "@/utils/todo";
import type { TodoPriority } from "@/types/todo";

const priorities: TodoPriority[] = ["LOW", "MEDIUM", "HIGH"];

export function CreateTodoSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const { mutateAsync: createTodo, isPending } = useCreateTodo();
  const { data: categories } = useCategories();

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setSelectedCategoryIds([]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      await createTodo({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate
          ? new Date(dueDate).toISOString()
          : new Date().toISOString(),
        categories: selectedCategoryIds,
      });
      reset();
      setIsOpen(false);
    } catch {
      // error handled by query client
    }
  };

  return (
    <>
      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary-500 items-center justify-center shadow-lg"
        onPress={() => setIsOpen(true)}
      >
        <Text className="text-white text-3xl leading-none">+</Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable className="flex-1 bg-black/40" onPress={() => setIsOpen(false)} />
          <View className="bg-white rounded-t-2xl max-h-[85%]">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
            >
              <Heading size="lg" className="mb-5">
                New Todo
              </Heading>

              <VStack className="gap-4">
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
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

                <Input variant="outline" size="md">
                  <InputField
                    placeholder="Due date (YYYY-MM-DD)"
                    value={dueDate}
                    onChangeText={setDueDate}
                  />
                </Input>

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

                {categories && categories.length > 0 && (
                  <>
                    <Text size="sm" className="text-typography-500 font-medium mt-1">
                      Categories
                    </Text>
                    <Box className="flex-row flex-wrap gap-2">
                      {categories.map((cat) => {
                        const isSelected = selectedCategoryIds.includes(cat.id);
                        return (
                          <Pressable
                            key={cat.id}
                            className={`flex-row items-center gap-2 px-3 py-2 rounded-lg border ${
                              isSelected
                                ? "border-primary-500 bg-primary-50"
                                : "border-outline-200"
                            }`}
                            onPress={() => toggleCategory(cat.id)}
                          >
                            <Box
                              className={`w-3.5 h-3.5 rounded border-2 items-center justify-center ${
                                isSelected
                                  ? "bg-primary-500 border-primary-500"
                                  : "border-outline-300"
                              }`}
                            >
                              {isSelected && (
                                <Text className="text-white text-[10px] font-bold">
                                  ✓
                                </Text>
                              )}
                            </Box>
                            <Text size="sm" className="text-typography-700">
                              {cat.name}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </Box>
                  </>
                )}

                <Box className="flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    action="secondary"
                    className="flex-1"
                    onPress={() => {
                      reset();
                      setIsOpen(false);
                    }}
                  >
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button
                    action="primary"
                    variant="solid"
                    className="flex-1"
                    isDisabled={!title.trim() || isPending}
                    onPress={handleSubmit}
                  >
                    <ButtonText>{isPending ? "Saving\u2026" : "Save"}</ButtonText>
                  </Button>
                </Box>
              </VStack>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}