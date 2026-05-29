import { useState } from "react";
import { router, Stack } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { useRegister } from "@/hooks/useAuth";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: register, isPending, error } = useRegister();

  const handleSignup = async () => {
    try {
      await register({ name, email, password });
      router.replace("/todos");
    } catch {
      // error is surfaced via the mutation's `error` state
    }
  };

  return (
    <View className="flex-1 bg-background-0 px-6 pt-6">
      <Stack.Screen options={{ title: "Sign Up" }} />

      <TextInput
        className="bg-background-100 text-typography-950 py-3.5 px-4 rounded-xl text-base mb-4 border border-outline-100"
        placeholder="Name"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

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
        onPress={handleSignup}
        disabled={isPending}
      >
        <Text className="text-primary-950 text-base font-semibold">
          {isPending ? "Creating account…" : "Create Account"}
        </Text>
      </TouchableOpacity>

      {error && (
        <Text className="text-error-500 text-center mt-4">
          {error.message || "Registration failed"}
        </Text>
      )}

      <TouchableOpacity
        className="mt-8 items-center"
        onPress={() => router.push("/login")}
      >
        <Text className="text-typography-500 text-sm">
          Already have an account?{" "}
          <Text className="text-primary-500 font-semibold">Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
