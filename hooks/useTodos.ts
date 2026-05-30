import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "@/services/todos";
import type { CreateTodoDto, TodoResponse, UpdateTodoDto } from "@/types/todo";

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
    onMutate: async ({ id, dto }) => {
      await qc.cancelQueries({ queryKey: todoKeys.all });
      const prevData = qc.getQueryData<TodoResponse[]>(todoKeys.all);
      qc.setQueryData<TodoResponse[]>(todoKeys.all, (old) =>
        old?.map((t) => (t.id === id ? { ...t, ...dto } : t)),
      );
      return { prevData };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        qc.setQueryData(todoKeys.all, context.prevData);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
