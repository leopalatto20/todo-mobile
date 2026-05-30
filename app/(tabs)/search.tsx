import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TodoCard } from "@/components/todo/TodoCard";
import { TodoCardSkeleton } from "@/components/todo/TodoCardSkeleton";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSearchTodos } from "@/hooks/useTodos";
import type { TodoPriority } from "@/types/todo";

const priorities: (TodoPriority | null)[] = [null, "LOW", "MEDIUM", "HIGH"];

const completionOptions: (boolean | null)[] = [null, false, true];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [priority, setPriority] = useState<TodoPriority | null>(null);
  const [completed, setCompleted] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchQuery]);

  const filters =
    priority !== null || completed !== null
      ? {
          ...(priority !== null && { priority }),
          ...(completed !== null && { completed }),
        }
      : undefined;

  const { data, isLoading, isError, error, refetch } = useSearchTodos(
    debouncedQuery,
    filters,
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <Box className="flex-1 px-6 relative">
        <Box className="flex-row justify-between items-center pb-2">
          <Heading size="xl" className="font-bold text-typography-950">
            Search
          </Heading>
        </Box>

        <Input variant="outline" size="md" className="mb-4">
          <InputField
            placeholder="Search todos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
        </Input>

        <VStack className="gap-3 mb-4">
          <Box className="flex-row gap-2">
            {priorities.map((p) => {
              const isActive = priority === p;
              const label = p === null ? "All" : p.charAt(0) + p.slice(1).toLowerCase();
              return (
                <Pressable
                  key={String(p)}
                  className={`px-3 py-1.5 rounded-full border ${
                    isActive
                      ? "bg-primary-500 border-primary-500"
                      : "border-outline-200"
                  }`}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    size="sm"
                    className={
                      isActive ? "text-white" : "text-typography-600"
                    }
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </Box>

          <Box className="flex-row gap-2">
            {completionOptions.map((c) => {
              const isActive = completed === c;
              const label = c === null ? "All" : c ? "Done" : "Pending";
              return (
                <Pressable
                  key={String(c)}
                  className={`px-3 py-1.5 rounded-full border ${
                    isActive
                      ? "bg-primary-500 border-primary-500"
                      : "border-outline-200"
                  }`}
                  onPress={() => setCompleted(c)}
                >
                  <Text
                    size="sm"
                    className={
                      isActive ? "text-white" : "text-typography-600"
                    }
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </Box>
        </VStack>

        {debouncedQuery.trim().length === 0 ? (
          <VStack className="flex-1 justify-center items-center gap-2">
            <Ionicons
              name="search-outline"
              size={48}
              color="rgb(163 163 163)"
            />
            <Text className="text-typography-400">
              Type to search todos
            </Text>
          </VStack>
        ) : isLoading ? (
          <VStack className="pt-2">
            <TodoCardSkeleton />
            <TodoCardSkeleton />
            <TodoCardSkeleton />
          </VStack>
        ) : isError ? (
          <VStack className="flex-1 justify-center items-center gap-4">
            <Text className="text-typography-500 text-center">
              {error?.message || "Something went wrong"}
            </Text>
            <Pressable onPress={() => refetch()}>
              <Text className="text-primary-500 font-semibold">Retry</Text>
            </Pressable>
          </VStack>
        ) : !data || data.length === 0 ? (
          <VStack className="flex-1 justify-center items-center gap-2">
            <Ionicons
              name="search-outline"
              size={48}
              color="rgb(163 163 163)"
            />
            <Text className="text-typography-400">No results found</Text>
          </VStack>
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
      </Box>
    </SafeAreaView>
  );
}
