import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
