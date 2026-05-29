import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
        <ActivityIndicator size="large" color="#4F8EF7" />
      </SafeAreaView>
    );
  }

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-0 px-6">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row justify-between items-center pt-4 pb-6">
        <Text className="text-3xl font-bold text-typography-950">
          Your Todos
        </Text>
        <TouchableOpacity
          className={`py-2 px-4 rounded-lg border border-error-500 ${
            isPending ? "opacity-60" : ""
          }`}
          onPress={handleSignOut}
          disabled={isPending}
        >
          <Text className="text-error-500 text-sm font-medium">
            {isPending ? "Signing out\u2026" : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center">
        <Text className="text-typography-500 text-base">
          Todo list coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
