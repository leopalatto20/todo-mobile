import { Box } from "@/components/ui/box";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export function TodoCardSkeleton() {
  return (
    <Box className="bg-white rounded-xl border border-outline-200 p-3.5 mb-3 flex-row items-center gap-3">
      <Skeleton className="w-5 h-5 rounded" />
      <Box className="flex-1 gap-1.5">
        <SkeletonText className="w-3/5 h-4" />
        <SkeletonText className="w-2/5 h-3" />
      </Box>
    </Box>
  );
}
