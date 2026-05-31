import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";


const features = [
  {
    icon: "checkmark-circle" as const,
    title: "Task management",
    desc: "Create, organize, and track todos with priorities and due dates. Mark tasks complete with a single tap.",
  },
  {
    icon: "folder-open" as const,
    title: "Categories",
    desc: "Group related tasks into color-coded categories. See progress at a glance with completion bars.",
  },
  {
    icon: "search" as const,
    title: "Full-text search",
    desc: "Find any task instantly by title or description. Filter by priority and completion status.",
  },
  {
    icon: "pricetag" as const,
    title: "Priorities",
    desc: "Flag tasks as High, Medium, or Low priority. Stay focused on what matters most.",
  },
  {
    icon: "chatbubble-ellipses" as const,
    title: "Comments",
    desc: "Add notes and context to any task. Keep discussions attached to the work they belong to.",
  },
  {
    icon: "pulse" as const,
    title: "Real-time sync",
    desc: "Powered by Firebase Auth and a REST API. Your data stays in sync across sessions.",
  },
];

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Box className="px-6 pt-8 pb-12">
          <Box className="pb-6 mb-8 border-b border-outline-200">
            <Heading size="xl" className="font-bold text-typography-950">
              About
            </Heading>
          </Box>

          <Box className="mb-12">
            <Text className="text-xs font-medium uppercase tracking-widest text-typography-400 mb-4">
              Why Todo
            </Text>
            <Heading size="2xl" className="font-bold text-typography-950 leading-tight mb-2">
              A focused workspace
            </Heading>
            <Heading size="2xl" className="font-bold text-typography-400 leading-tight mb-6">
              for getting things done.
            </Heading>
            <Text size="md" className="text-typography-500 leading-relaxed">
              Todo is a lean task manager built for clarity, not complexity.
              Organize work your way — with priorities, categories, and search
              that actually work.
            </Text>
          </Box>

          <Box className="gap-4 mb-12">
            {features.map((f) => (
              <Box
                key={f.title}
                className="flex-row items-start gap-4 p-4 rounded-xl border border-outline-200"
              >
                <Box className="w-10 h-10 rounded-lg bg-primary-500/10 items-center justify-center shrink-0">
                  <Ionicons name={f.icon} size={20} color="#4f46e5" />
                </Box>
                <Box className="flex-1 gap-1">
                  <Text size="md" className="font-semibold text-typography-950">
                    {f.title}
                  </Text>
                  <Text size="sm" className="text-typography-500 leading-relaxed">
                    {f.desc}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="border-t border-outline-200 pt-8 items-center">
            <Text size="sm" className="text-typography-400 text-center">
              Built with Expo, gluestack-ui, NativeWind, TanStack Query, Zustand, and Firebase.
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
