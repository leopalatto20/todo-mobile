import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export function ErrorTodoState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <VStack className="flex-1 justify-center items-center gap-4">
      <Text size="md" className="text-typography-500 text-center">
        {message}
      </Text>
      <Button action="primary" variant="solid" onPress={onRetry}>
        <ButtonText>Try Again</ButtonText>
      </Button>
    </VStack>
  );
}
