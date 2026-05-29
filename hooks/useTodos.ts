import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "@/services/todos";
import type { CreateTodoDto, UpdateTodoDto } from "@/types/todo";

const todoKeys = {
  all: ["todos"] as const,
  detail: (id: string) => ["todos", id] as const,
};

export function useTodos() {
  return useQuery({ queryKey: todoKeys.all, queryFn: todoService.getAll });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTodoDto) => todoService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTodoDto }) =>
      todoService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
