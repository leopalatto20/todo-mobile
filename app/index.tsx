import { router, Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

export default function HomeScreen() {
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
