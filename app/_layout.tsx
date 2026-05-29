import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    
    <GluestackUIProvider mode="dark">
      <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
    </GluestackUIProvider>
  
  );
}
