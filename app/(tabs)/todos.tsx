import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CreateTodoSheet } from "@/components/todo/CreateTodoSheet";
import { EmptyTodoState } from "@/components/todo/EmptyTodoState";
import { ErrorTodoState } from "@/components/todo/ErrorTodoState";
import { TodoCard } from "@/components/todo/TodoCard";
import { TodoCardSkeleton } from "@/components/todo/TodoCardSkeleton";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useSignOut } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { useAuthStore } from "@/stores/authStore";

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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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
      <StatusBar style="dark" />

      <Box className="flex-1 px-6 relative">
        <Box className="flex-row justify-between items-center pb-2">
          <Heading size="xl" className="font-bold text-typography-950">
            Your Todos
          </Heading>
          <Pressable
            onPress={handleSignOut}
            disabled={isPending}
            className="p-2"
          >
            <Ionicons
              name={isPending ? "hourglass-outline" : "log-out-outline"}
              size={22}
              color="rgb(163 163 163)"
            />
          </Pressable>
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        <CreateTodoSheet />
      </Box>
    </SafeAreaView>
  );
}
