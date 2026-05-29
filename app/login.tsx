import { useState } from "react";
import { router, Stack } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { useSignIn } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/users";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: signIn, isPending, error } = useSignIn();

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
      const profile = await userService.getProfile();
      useAuthStore.getState().setUser(profile as any);
      router.replace("/todos");
    } catch {
      // error is surfaced via the mutation's `error` state
    }
  };

  return (
    <View className="flex-1 bg-background-0 px-6 pt-6">
      <Stack.Screen options={{ title: "Log In" }} />

      <TextInput
        className="bg-background-100 text-typography-950 py-3.5 px-4 rounded-xl text-base mb-4 border border-outline-100"
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        className="bg-background-100 text-typography-950 py-3.5 px-4 rounded-xl text-base mb-4 border border-outline-100"
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className={`bg-primary-500 py-4 rounded-xl items-center mt-2 ${
          isPending ? "opacity-60" : ""
        }`}
        onPress={handleLogin}
        disabled={isPending}
      >
        <Text className="text-primary-950 text-base font-semibold">
          {isPending ? "Signing in…" : "Sign In"}
        </Text>
      </TouchableOpacity>

      {error && (
        <Text className="text-error-500 text-center mt-4">
          {error.message || "Invalid email or password"}
        </Text>
      )}

      <TouchableOpacity
        className="mt-8 items-center"
        onPress={() => router.push("/signup")}
      >
        <Text className="text-typography-500 text-sm">
          {"Don't have an account? "}
          <Text className="text-primary-500 font-semibold">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
