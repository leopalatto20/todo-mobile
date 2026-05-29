# Auth Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Home, Login, Signup, and placeholder Todos screens with auth flow.

**Architecture:** Flat stack routes under existing root layout. Each screen is a standalone file. Auth hooks/stores/services already exist. Styling via NativeWind `className` using Gluestack theme CSS variables (dark mode).

**Tech Stack:** Expo Router, NativeWind (Tailwind classes + Gluestack theme vars), Firebase Auth (via existing `useAuthStore`), TanStack Query (via existing hooks: `useSignIn`, `useRegister`, `useSignOut`).

---

### Task 1: Home screen

**Files:**
- Modify: `app/index.tsx`

- [ ] **Step 1: Replace `app/index.tsx` with home screen**

```tsx
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background-0 justify-center px-6">
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
```

- [ ] **Step 2: Verify the app builds/runs**

Run: `npx expo start --ios` (or `--android`) and confirm home screen renders with Login and Sign Up buttons.

---

### Task 2: Login screen

**Files:**
- Create: `app/login.tsx`

- [ ] **Step 1: Create `app/login.tsx`**

```tsx
import { useState } from "react";
import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { useSignIn } from "@/hooks/useAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: signIn, isPending, error } = useSignIn();

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
      router.replace("/todos");
    } catch {
      // error is surfaced via the mutation's `error` state
    }
  };

  return (
    <View className="flex-1 bg-background-0 px-6 pt-6">
      <Text className="text-3xl font-bold text-typography-950 mb-8">
        Log In
      </Text>

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
          Don't have an account?{" "}
          <Text className="text-primary-500 font-semibold">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 2: Verify route works**

Navigate to Login from Home, confirm form renders, back button works.

---

### Task 3: Signup screen

**Files:**
- Create: `app/signup.tsx`

- [ ] **Step 1: Create `app/signup.tsx`**

```tsx
import { useState } from "react";
import { router } from "expo-router";
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
      <Text className="text-3xl font-bold text-typography-950 mb-8">
        Sign Up
      </Text>

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
```

- [ ] **Step 2: Verify route works**

Navigate to Signup from Home, confirm form renders, back button works.

---

### Task 4: Placeholder todos screen

**Files:**
- Create: `app/todos.tsx`

- [ ] **Step 1: Create `app/todos.tsx`**

```tsx
import { useEffect } from "react";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useSignOut } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

export default function TodosScreen() {
  const user = useAuthStore((s) => s.user);
  const { mutateAsync: signOut, isPending } = useSignOut();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  if (!user) return null;

  return (
    <View className="flex-1 bg-background-0 px-6">
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
            {isPending ? "Signing out…" : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center">
        <Text className="text-typography-500 text-base">
          Todo list coming soon
        </Text>
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Verify auth gate works**

Login or Signup redirects to `/todos`. Sign Out returns to Home. Unauthenticated access to `/todos` redirects to Home.
