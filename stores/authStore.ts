import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      firebaseUser: null,

      signIn: async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const token = await credential.user.getIdToken();
        set({
          firebaseUser: credential.user,
          token,
        });
      },

      signOut: async () => {
        await firebaseSignOut(auth);
        set({ user: null, token: null, firebaseUser: null });
      },

      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

// Listens for Firebase auth state changes. The `user` field (backend User object)
// is populated separately by fetching GET /users/me using the stored token.
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    useAuthStore.setState({ firebaseUser, token, isLoading: false });
  } else {
    useAuthStore.setState({
      firebaseUser: null,
      user: null,
      token: null,
      isLoading: false,
    });
  }
});
