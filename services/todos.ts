import api from "./api";
import type {
  TodoResponse,
  TodoDetailResponse,
  CreateTodoDto,
  UpdateTodoDto,
  TodoPriority,
} from "@/types/todo";

export const todoService = {
  getAll: () => api.get<TodoResponse[]>("/todos").then((r) => r.data),

  getById: (id: string) =>
    api.get<TodoDetailResponse>(`/todos/${id}`).then((r) => r.data),

  create: (dto: CreateTodoDto) =>
    api.post<TodoResponse>("/todos", dto).then((r) => r.data),

  update: (id: string, dto: UpdateTodoDto) =>
    api.patch<TodoResponse>(`/todos/${id}`, dto).then((r) => r.data),

  delete: (id: string) => api.delete(`/todos/${id}`),

  search: (
    query: string,
    filters?: { completed?: boolean; priority?: TodoPriority },
  ) =>
    api
      .get<TodoResponse[]>(`/todos/search/${encodeURIComponent(query)}`, {
        params: filters,
      })
      .then((r) => r.data),
};
