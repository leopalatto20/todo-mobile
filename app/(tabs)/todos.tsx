import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useTodos } from "@/hooks/useTodos";
import { useSignOut } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { formatDueDate, isOverdue } from "@/utils/date";
import type { TodoResponse, TodoPriority } from "@/types/todo";

const priorityColor: Record<TodoPriority, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-green-500",
};

const priorityLabel: Record<TodoPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

function TodoCard({ item }: { item: TodoResponse }) {
  const overdue = isOverdue(item.dueDate) && !item.completed;

  return (
    <Box className="bg-white rounded-xl border border-outline-200 p-3.5 mb-3 flex-row items-center gap-3">
      <Box className="w-5 h-5 rounded border-2 border-outline-300 bg-background-0" />

      <Box className="flex-1">
        <Heading size="sm" className="text-typography-950 font-semibold">
          {item.title}
        </Heading>

        <Box className="flex-row items-center gap-2 mt-1">
          <Text
            size="xs"
            className={overdue ? "text-red-500" : "text-typography-400"}
          >
            {formatDueDate(item.dueDate)}
          </Text>
        </Box>
      </Box>

      <Box className="flex-row items-center gap-1.5">
        <Box className={`w-2.5 h-2.5 rounded-full ${priorityColor[item.priority]}`} />
        <Text size="xs" className="text-typography-500">
          {priorityLabel[item.priority]}
        </Text>
      </Box>
    </Box>
  );
}

function SkeletonCard() {
  return (
    <Box className="bg-white rounded-xl border border-outline-200 p-3.5 mb-3 flex-row items-center gap-3">
      <Skeleton className="w-5 h-5 rounded" />
      <Box className="flex-1 gap-1.5">
        <SkeletonText className="w-3/5 h-4" />
        <SkeletonText className="w-2/5 h-3" />
      </Box>
    </Box>
  );
}

export default function TodosScreen() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const token = useAuthStore((s) => s.token);
  const { mutateAsync: signOut, isPending } = useSignOut();
  const { data, isLoading: isTodosLoading, isError, error, refetch } = useTodos();

  useEffect(() => {
    if (!isLoading && !user && !token) {
      router.replace("/");
    }
  }, [user, isLoading, token]);

  const handleSignOut = () => {
    signOut().then(() => router.replace("/")).catch(() => {});
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

      {isTodosLoading ? (
        <VStack className="flex-1 pt-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </VStack>
      ) : isError ? (
        <VStack className="flex-1 justify-center items-center gap-4">
          <Text size="md" className="text-typography-500 text-center">
            {error?.message || "Something went wrong"}
          </Text>
          <Button action="primary" variant="solid" onPress={() => refetch()}>
            <ButtonText>Try Again</ButtonText>
          </Button>
        </VStack>
      ) : !data || data.length === 0 ? (
        <VStack className="flex-1 justify-center items-center gap-2">
          <Text size="2xl">📋</Text>
          <Text size="md" className="text-typography-500">
            No todos yet
          </Text>
        </VStack>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TodoCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}