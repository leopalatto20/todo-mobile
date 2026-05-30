import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/comments";
import type { AddCommentDto } from "@/types/comment";

export function useAddComment(todoId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddCommentDto) => commentService.add(todoId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos", todoId] });
    },
  });
}
