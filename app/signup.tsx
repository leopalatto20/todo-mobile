import { useState } from "react";
import { Stack, useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/users";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: register, isPending, error } = useRegister();

  const handleSignup = async () => {
    try {
      await register({ name, email, password });
      const profile = await userService.getProfile();
      useAuthStore.getState().setUser(profile);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "(tabs)" }],
        }),
      );
    } catch {
      // error is surfaced via the mutation's `error` state
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
    <Box className="flex-1 bg-background-0 px-6 pt-6">
      <Stack.Screen options={{ title: "Sign Up" }} />
      <Box className="pb-4 mb-4 border-b border-outline-200">
        <Heading size="xl" className="font-bold text-typography-950">
          Sign Up
        </Heading>
      </Box>

      <FormControl className="mb-4">
        <FormControlLabel className="mb-1">
          <FormControlLabelText className="text-typography-700 text-sm">
            Name
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </Input>
      </FormControl>

      <FormControl className="mb-4">
        <FormControlLabel className="mb-1">
          <FormControlLabelText className="text-typography-700 text-sm">
            Email
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Input>
      </FormControl>

      <FormControl className="mb-4">
        <FormControlLabel className="mb-1">
          <FormControlLabelText className="text-typography-700 text-sm">
            Password
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Input>
      </FormControl>

      <Button className="mt-2" onPress={handleSignup} isDisabled={isPending}>
        <ButtonText>
          {isPending ? "Creating account\u2026" : "Create Account"}
        </ButtonText>
      </Button>

      {error && (
        <Text className="text-error-500 text-center mt-4">
          {error.message || "Registration failed"}
        </Text>
      )}

      <Button
        variant="link"
        className="mt-8"
        onPress={() => router.push("/login")}
      >
        <ButtonText className="text-typography-500 text-sm">
          Already have an account?{" "}
          <Text className="text-primary-500 font-semibold">Log in</Text>
        </ButtonText>
      </Button>
    </Box>
    </SafeAreaView>
  );
}
