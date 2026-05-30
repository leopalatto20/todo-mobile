import api from "./api";
import type {
  TodoResponse,
  TodoDetailResponse,
  CreateTodoDto,
  UpdateTodoDto,
} from "@/types/todo";

export const todoService = {
  getAll: () => api.get<TodoResponse[]>("/todos").then((r) => r.data),

  getById: (id: string) =>
    api.get<TodoDetailResponse>(`/todos/${id}`).then((r) => r.data),

  create: (dto: CreateTodoDto) =>
    api.post<TodoResponse>("/todos", dto).then((r) => r.data),

  update: (id: string, dto: UpdateTodoDto) => {
    console.log("[todoService.update] id:", id, "dto:", JSON.stringify(dto));
    return api.patch<TodoResponse>(`/todos/${id}`, dto).then((r) => {
      console.log("[todoService.update] response data:", JSON.stringify(r.data));
      return r.data;
    });
  },

  delete: (id: string) => api.delete(`/todos/${id}`),
};
