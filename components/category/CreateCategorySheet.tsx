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
import { useCreateCategory } from "@/hooks/useCategories";
import { PRESET_COLOR_NAMES, resolveColor } from "@/utils/colors";

const PRESET_COLORS = PRESET_COLOR_NAMES;

export function CreateCategorySheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const reset = () => {
    setName("");
    setDescription("");
    setColor(PRESET_COLORS[0]);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      await createCategory({
        name: name.trim(),
        description: description.trim(),
        color,
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
          <Pressable
            className="flex-1 bg-black/40"
            onPress={() => setIsOpen(false)}
          />
          <View className="bg-white rounded-t-2xl max-h-[85%]">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 40,
              }}
            >
              <Heading size="lg" className="mb-5">
                New Category
              </Heading>

              <VStack className="gap-4">
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
                    isDisabled={!name.trim() || isPending}
                    onPress={handleSubmit}
                  >
                    <ButtonText>
                      {isPending ? "Saving\u2026" : "Save"}
                    </ButtonText>
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
