import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/authStore";

export default function HomeScreen() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/(tabs)/todos");
    }
  }, [isLoading, token]);

  if (isLoading) {
    return (
      <Box className="flex-1 bg-background-0 justify-center items-center">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0 justify-center px-6">
      <Stack.Screen options={{ headerShown: false }} />
      <VStack className="items-center">
        <Heading size="4xl" className="font-bold text-typography-950 mb-2">
          Todo App
        </Heading>
        <Text size="lg" className="text-typography-500">
          Stay organized, get things done
        </Text>
      </VStack>

      <VStack className="mt-12" space="md">
        <Button onPress={() => router.push("/login")}>
          <ButtonText>Login</ButtonText>
        </Button>

        <Button variant="outline" onPress={() => router.push("/signup")}>
          <ButtonText>Sign Up</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
