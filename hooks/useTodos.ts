import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "@/services/todos";
import type { CreateTodoDto, TodoPriority, TodoResponse, UpdateTodoDto } from "@/types/todo";

const todoKeys = {
  all: ["todos"] as const,
  detail: (id: string) => ["todos", id] as const,
  search: (
    query: string,
    filters?: { completed?: boolean; priority?: TodoPriority },
  ) => ["todos", "search", query, filters] as const,
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
        old?.map((t) => {
          if (t.id !== id) return t;
          const updated = { ...t };
          if (dto.title !== undefined) updated.title = dto.title;
          if (dto.description !== undefined)
            updated.description = dto.description;
          if (dto.priority !== undefined) updated.priority = dto.priority;
          if (dto.completed !== undefined) updated.completed = dto.completed;
          if (dto.dueDate !== undefined) updated.dueDate = dto.dueDate;
          return updated;
        }),
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
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: todoKeys.all });
      const prevData = qc.getQueryData<TodoResponse[]>(todoKeys.all);
      qc.setQueryData<TodoResponse[]>(todoKeys.all, (old) =>
        old?.filter((t) => t.id !== id),
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

export function useSearchTodos(
  query: string,
  filters?: { completed?: boolean; priority?: TodoPriority },
) {
  return useQuery({
    queryKey: todoKeys.search(query, filters),
    queryFn: () => todoService.search(query, filters),
    enabled: query.trim().length > 0,
  });
}
