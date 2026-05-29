import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export function EmptyTodoState() {
  return (
    <VStack className="flex-1 justify-center items-center gap-2">
      <Text size="2xl">📋</Text>
      <Text size="md" className="text-typography-500">
        No todos yet
      </Text>
    </VStack>
  );
}
