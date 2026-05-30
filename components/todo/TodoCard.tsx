import { Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { PriorityBadge } from "./PriorityBadge";
import type { TodoResponse } from "@/types/todo";
import { formatDueDate, isOverdue } from "@/utils/date";
import { resolveColor } from "@/utils/colors";
import { useUpdateTodo } from "@/hooks/useTodos";

export function TodoCard({ item }: { item: TodoResponse }) {
  const { mutate: updateTodo } = useUpdateTodo();
  const overdue = isOverdue(item.dueDate) && !item.completed;

  const handleToggle = () => {
    updateTodo({ id: item.id, dto: { completed: !item.completed } });
  };

  return (
    <Box className="bg-white rounded-xl border border-outline-200 p-3.5 mb-3 flex-row items-center gap-3">
      <Pressable onPress={handleToggle}>
        <Box
          className={`w-5 h-5 rounded border-2 items-center justify-center ${
            item.completed
              ? "bg-green-500 border-green-500"
              : "border-outline-300 bg-background-0"
          }`}
        />
      </Pressable>

      <Box className="flex-1">
        <Heading size="sm" className="text-typography-950 font-semibold">
          {item.title}
        </Heading>
        <Text size="xs" className="text-typography-400">
          {item.description}
        </Text>

        <Box className="flex-row flex-wrap gap-1.5 mt-1">
          {item.categories.map((cat) => (
            <Box
              key={cat.id}
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: resolveColor(cat.color) }}
            >
              <Text size="xs" className="text-white font-medium">
                {cat.name}
              </Text>
            </Box>
          ))}
        </Box>

        <Box className="flex-row items-center gap-2 mt-1">
          <Text
            size="xs"
            className={overdue ? "text-red-500" : "text-typography-400"}
          >
            {formatDueDate(item.dueDate)}
          </Text>
        </Box>
      </Box>

      <PriorityBadge priority={item.priority} />
    </Box>
  );
}
