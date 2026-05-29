import { router, Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background-0 justify-center px-6">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="items-center">
        <Text className="text-5xl font-bold text-typography-950 mb-2">
          Todo App
        </Text>
        <Text className="text-lg text-typography-500">
          Stay organized, get things done
        </Text>
      </View>

      <View className="mt-12 gap-3">
        <TouchableOpacity
          className="bg-primary-500 py-4 rounded-xl items-center"
          onPress={() => router.push("/login")}
        >
          <Text className="text-primary-950 text-base font-semibold">
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-primary-500 py-4 rounded-xl items-center"
          onPress={() => router.push("/signup")}
        >
          <Text className="text-primary-500 text-base font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
