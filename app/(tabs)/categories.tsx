import { Stack } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCategoriesWithTodos } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/category/CategoryCard";
import { CreateCategorySheet } from "@/components/category/CreateCategorySheet";

export default function CategoriesScreen() {
  const { data, isLoading, isError, error, refetch } = useCategoriesWithTodos();
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
        <Box className="pb-4 mb-4 border-b border-outline-200">
          <Heading size="xl" className="font-bold text-typography-950">
            Categories
          </Heading>
        </Box>

        {isLoading ? (
          <VStack className="flex-1" />
        ) : isError ? (
          <VStack className="flex-1 justify-center items-center gap-4">
            <Text size="md" className="text-typography-500 text-center">
              {error?.message || "Something went wrong"}
            </Text>
          </VStack>
        ) : !data || data.length === 0 ? (
          <VStack className="flex-1 justify-center items-center gap-2">
            <Text size="2xl">🏷️</Text>
            <Text size="md" className="text-typography-500">
              No categories yet
            </Text>
          </VStack>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CategoryCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        <CreateCategorySheet />
      </Box>
    </SafeAreaView>
  );
}