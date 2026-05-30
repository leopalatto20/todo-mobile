import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/users";
import type { CreateUserDto } from "@/types/user";

export function useSignIn() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });
}

export function useSignOut() {
  const signOut = useAuthStore((s) => s.signOut);
  return useMutation({
    mutationFn: () => signOut(),
  });
}

export function useRegister() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: CreateUserDto & { password: string }) => {
      await userService.register({ name, email, password });
      await signIn(email, password);
    },
  });
}
