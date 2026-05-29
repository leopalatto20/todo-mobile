import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
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
  const { mutateAsync: createTodo, isPending } = useCreateTodo();

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      await createTodo({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || new Date().toISOString(),
        categories: [],
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
        <View className="flex-1">
          <Pressable className="flex-1 bg-black/40" onPress={() => setIsOpen(false)} />
          <View className="bg-white rounded-t-2xl px-6 pt-6 pb-10">
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
          </View>
        </View>
      </Modal>
    </>
  );
}