import type { CommentResponse, AddCommentDto } from "@/types/comment";
import api from "./api";

export const commentService = {
  add: (todoId: string, dto: AddCommentDto) =>
    api
      .post<CommentResponse>(`/todos/${todoId}/comments`, dto)
      .then((r) => r.data),
};
