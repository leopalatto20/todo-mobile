import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { CategoryResponse } from "@/types/category";
import { resolveColor } from "@/utils/colors";

export function CategoryCard({ item }: { item: CategoryResponse }) {
  return (
    <Box className="bg-white rounded-xl border border-outline-200 mb-3 overflow-hidden">
      <Box className="flex-row">
        <Box style={{ width: 5, backgroundColor: resolveColor(item.color) }} />
        <Box className="flex-1 p-3.5">
          <Heading size="sm" className="text-typography-950 font-semibold">
            {item.name}
          </Heading>
          <Text size="xs" className="text-typography-400">
            {item.description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}