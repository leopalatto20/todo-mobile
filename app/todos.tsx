import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignOut } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

export default function TodosScreen() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { mutateAsync: signOut, isPending } = useSignOut();

  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!isLoading && !user && !token) {
      router.replace("/");
    }
  }, [user, isLoading, token]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0 justify-center items-center">
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-0 px-6">
      <Stack.Screen options={{ headerShown: false }} />

      <Box className="flex-row justify-between items-center pt-4 pb-6">
        <Heading size="xl" className="font-bold text-typography-950">
          Your Todos
        </Heading>
        <Button
          variant="outline"
          action="negative"
          onPress={handleSignOut}
          isDisabled={isPending}
        >
          <ButtonText>
            {isPending ? "Signing out\u2026" : "Sign Out"}
          </ButtonText>
        </Button>
      </Box>

      <VStack className="flex-1 justify-center items-center">
        <Text size="md" className="text-typography-500">
          Todo list coming soon
        </Text>
      </VStack>
    </SafeAreaView>
  );
}
