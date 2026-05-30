import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import type { TodoPriority } from "@/types/todo";
import { priorityColor, priorityLabel } from "@/utils/todo";

export function PriorityBadge({ priority }: { priority: TodoPriority }) {
  return (
    <Box className="flex-row items-center gap-1.5">
      <Box className={`w-2.5 h-2.5 rounded-full ${priorityColor[priority]}`} />
      <Text size="xs" className="text-typography-500">
        {priorityLabel[priority]}
      </Text>
    </Box>
  );
}
