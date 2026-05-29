import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useSignOut } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { useAuthStore } from "@/stores/authStore";
import { TodoCard } from "@/components/todo/TodoCard";
import { TodoCardSkeleton } from "@/components/todo/TodoCardSkeleton";
import { EmptyTodoState } from "@/components/todo/EmptyTodoState";
import { ErrorTodoState } from "@/components/todo/ErrorTodoState";
import { CreateTodoSheet } from "@/components/todo/CreateTodoSheet";

export default function TodosScreen() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const token = useAuthStore((s) => s.token);
  const { mutateAsync: signOut, isPending } = useSignOut();
  const {
    data,
    isLoading: isTodosLoading,
    isError,
    error,
    refetch,
  } = useTodos();

  useEffect(() => {
    if (!isLoading && !user && !token) {
      router.replace("/");
    }
  }, [user, isLoading, token]);

  const handleSignOut = () => {
    signOut()
      .then(() => router.replace("/"))
      .catch(() => {});
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
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen options={{ headerShown: false }} />

      <Box className="flex-1 px-6 relative">
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

        {isTodosLoading ? (
          <VStack className="flex-1 pt-2">
            <TodoCardSkeleton />
            <TodoCardSkeleton />
            <TodoCardSkeleton />
          </VStack>
        ) : isError ? (
          <ErrorTodoState
            message={error?.message || "Something went wrong"}
            onRetry={refetch}
          />
        ) : !data || data.length === 0 ? (
          <EmptyTodoState />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TodoCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            className="flex-1"
          />
        )}

        <CreateTodoSheet />
      </Box>
    </SafeAreaView>
  );
}