# Gluestack UI Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all raw RN primitives with gluestack-ui components across 4 screens (index, login, signup, todos).

**Architecture:** Install 8 gluestack component packages (`button`, `input`, `form-control`, `text`, `heading`, `box`, `spinner`, `vstack`). Each screen gets a 1:1 component swap preserving visual output and auth routing.

**Tech Stack:** Expo SDK 54, React Native 0.81, GluestackUI v3, NativeWind v4, TypeScript

---

### Task 1: Install gluestack component packages

**Files:**
- Modify: `package.json`

- [ ] **Install all 8 packages**

Run:
```bash
bun add @gluestack-ui/button
bun add @gluestack-ui/input
bun add @gluestack-ui/form-control
bun add @gluestack-ui/text
bun add @gluestack-ui/heading
bun add @gluestack-ui/box
bun add @gluestack-ui/spinner
bun add @gluestack-ui/vstack
```

Expected: All packages added to `package.json` dependencies with versions resolved.

- [ ] **Commit**

```bash
git add package.json bun.lock
git commit -m "feat: install gluestack-ui component packages"
```

---

### Task 2: Refactor `app/index.tsx` (landing page)

**Files:**
- Modify: `app/index.tsx`

Current: Uses `View`, `Text`, `TouchableOpacity` from `react-native`. Target: `VStack`, `Heading`, `Text`, `Button`, `ButtonText` from gluestack.

- [ ] **Rewrite the file**

```tsx
import { router, Stack } from "expo-router";
import { VStack } from "@gluestack-ui/vstack";
import { Heading } from "@gluestack-ui/heading";
import { Text } from "@gluestack-ui/text";
import { Button, ButtonText } from "@gluestack-ui/button";

export default function HomeScreen() {
  return (
    <VStack className="flex-1 bg-background-0 justify-center px-6">
      <Stack.Screen options={{ headerShown: false }} />
      <VStack className="items-center">
        <Heading className="text-5xl font-bold text-typography-950 mb-2">
          Todo App
        </Heading>
        <Text className="text-lg text-typography-500">
          Stay organized, get things done
        </Text>
      </VStack>

      <VStack className="mt-12 gap-3">
        <Button onPress={() => router.push("/login")}>
          <ButtonText className="text-primary-950 text-base font-semibold">
            Login
          </ButtonText>
        </Button>

        <Button
          variant="outline"
          onPress={() => router.push("/signup")}
        >
          <ButtonText className="text-primary-500 text-base font-semibold">
            Sign Up
          </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
```

- [ ] **Commit**

```bash
git add app/index.tsx
git commit -m "refactor: replace RN primitives with gluestack components in landing page"
```

---

### Task 3: Refactor `app/login.tsx` (login page)

**Files:**
- Modify: `app/login.tsx`

Current: `View`, `Text`, `TextInput`, `TouchableOpacity`. Target: `Box`, `FormControl` + `FormControlLabel` + `FormControlError`, `Input` + `InputField`, `Button` + `ButtonText`, `Text`.

- [ ] **Rewrite the file**

```tsx
import { useState } from "react";
import { router, Stack } from "expo-router";
import { Box } from "@gluestack-ui/box";
import { Text } from "@gluestack-ui/text";
import { Button, ButtonText } from "@gluestack-ui/button";
import { Input, InputField } from "@gluestack-ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/form-control";

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
      useAuthStore.getState().setUser(profile);
      router.replace("/todos");
    } catch {
      // error is surfaced via the mutation's `error` state
    }
  };

  return (
    <Box className="flex-1 bg-background-0 px-6 pt-6">
      <Stack.Screen options={{ title: "Log In" }} />

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

      <Button
        className="mt-2"
        onPress={handleLogin}
        isDisabled={isPending}
      >
        <ButtonText className="text-primary-950 text-base font-semibold">
          {isPending ? "Signing in\u2026" : "Sign In"}
        </ButtonText>
      </Button>

      {error && (
        <Text className="text-error-500 text-center mt-4">
          {error.message || "Invalid email or password"}
        </Text>
      )}

      <Button
        variant="link"
        className="mt-8"
        onPress={() => router.push("/signup")}
      >
        <ButtonText className="text-typography-500 text-sm">
          {"Don't have an account? "}
          <Text className="text-primary-500 font-semibold">Sign up</Text>
        </ButtonText>
      </Button>
    </Box>
  );
}
```

- [ ] **Commit**

```bash
git add app/login.tsx
git commit -m "refactor: replace RN primitives with gluestack components in login page"
```

---

### Task 4: Refactor `app/signup.tsx` (registration page)

**Files:**
- Modify: `app/signup.tsx`

Same pattern as login with 3 fields (name, email, password).

- [ ] **Rewrite the file**

```tsx
import { useState } from "react";
import { router, Stack } from "expo-router";
import { Box } from "@gluestack-ui/box";
import { Text } from "@gluestack-ui/text";
import { Button, ButtonText } from "@gluestack-ui/button";
import { Input, InputField } from "@gluestack-ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/form-control";

import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/users";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: register, isPending, error } = useRegister();

  const handleSignup = async () => {
    try {
      await register({ name, email, password });
      const profile = await userService.getProfile();
      useAuthStore.getState().setUser(profile);
      router.replace("/todos");
    } catch {
      // error is surfaced via the mutation's `error` state
    }
  };

  return (
    <Box className="flex-1 bg-background-0 px-6 pt-6">
      <Stack.Screen options={{ title: "Sign Up" }} />

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

      <Button
        className="mt-2"
        onPress={handleSignup}
        isDisabled={isPending}
      >
        <ButtonText className="text-primary-950 text-base font-semibold">
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
  );
}
```

- [ ] **Commit**

```bash
git add app/signup.tsx
git commit -m "refactor: replace RN primitives with gluestack components in signup page"
```

---

### Task 5: Refactor `app/todos.tsx` (todos list)

**Files:**
- Modify: `app/todos.tsx`

Current: `SafeAreaView`, `View`, `Text`, `TouchableOpacity`, `ActivityIndicator`. Target: `Box`, `VStack`, `Heading`, `Text`, `Button` + `ButtonText`, `Spinner`. Keep `SafeAreaView` from `react-native-safe-area-context`.

- [ ] **Rewrite the file**

```tsx
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@gluestack-ui/vstack";
import { Box } from "@gluestack-ui/box";
import { Heading } from "@gluestack-ui/heading";
import { Text } from "@gluestack-ui/text";
import { Button, ButtonText } from "@gluestack-ui/button";
import { Spinner } from "@gluestack-ui/spinner";
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
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-0 px-6">
      <Stack.Screen options={{ headerShown: false }} />

      <Box className="flex-row justify-between items-center pt-4 pb-6">
        <Heading className="text-3xl font-bold text-typography-950">
          Your Todos
        </Heading>
        <Button
          variant="outline"
          borderColor="$error-500"
          onPress={handleSignOut}
          isDisabled={isPending}
        >
          <ButtonText className="text-error-500 text-sm font-medium">
            {isPending ? "Signing out\u2026" : "Sign Out"}
          </ButtonText>
        </Button>
      </Box>

      <VStack className="flex-1 justify-center items-center">
        <Text className="text-typography-500 text-base">
          Todo list coming soon
        </Text>
      </VStack>
    </SafeAreaView>
  );
}
```

- [ ] **Commit**

```bash
git add app/todos.tsx
git commit -m "refactor: replace RN primitives with gluestack components in todos page"
```

---

### Task 6: Final verification

- [ ] **Run lint**

```bash
npm run lint
```

Expected: No errors (known `import/no-unresolved` for `@/*` path aliases is pre-existing and expected — ignore those).

- [ ] **Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No type errors. (Known `@/*` alias issue with Expo ESLint — ignore those.)

- [ ] **Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final cleanup after gluestack refactor"
```
