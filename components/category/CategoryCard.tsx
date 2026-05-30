import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import type { CategoryWithTodosResponse } from "@/types/todo";
import { resolveColor } from "@/utils/colors";

export function CategoryCard({ item }: { item: CategoryWithTodosResponse }) {
  const total = item.todos.length;
  const completed = item.todos.filter((t) => t.completed).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Box className="bg-white rounded-xl border border-outline-200 mb-3 overflow-hidden">
      <Box className="flex-row">
        <Box style={{ width: 5, backgroundColor: resolveColor(item.color) }} />
        <Box className="flex-1 p-3.5 gap-2">
          <Heading size="sm" className="text-typography-950 font-semibold">
            {item.name}
          </Heading>
          <Text size="xs" className="text-typography-400">
            {item.description}
          </Text>
          {total > 0 && (
            <Box className="gap-1">
              <Progress value={pct} size="xs" className="w-full">
                <ProgressFilledTrack />
              </Progress>
              <Text size="xs" className="text-typography-400">
                {completed}/{total} ({pct}%)
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}