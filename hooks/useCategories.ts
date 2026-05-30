import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categories";
import type {
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category";

const categoryKeys = {
  all: ["categories"] as const,
  withTodos: ["categories", "with-todos"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoryService.getAll,
  });
}

export function useCategoriesWithTodos() {
  return useQuery({
    queryKey: categoryKeys.withTodos,
    queryFn: categoryService.getWithTodos,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [...categoryKeys.all, id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => categoryService.create(dto),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: categoryKeys.all, refetchType: "all" }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDto }) =>
      categoryService.update(id, dto),
    onMutate: async ({ id, dto }) => {
      await qc.cancelQueries({ queryKey: categoryKeys.all });
      const prevData = qc.getQueryData<CategoryResponse[]>(categoryKeys.all);
      qc.setQueryData<CategoryResponse[]>(categoryKeys.all, (old) =>
        old?.map((c) => {
          if (c.id !== id) return c;
          return { ...c, ...dto };
        }),
      );
      return { prevData };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        qc.setQueryData(categoryKeys.all, context.prevData);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: categoryKeys.all });
      const prevData = qc.getQueryData<CategoryResponse[]>(categoryKeys.all);
      qc.setQueryData<CategoryResponse[]>(categoryKeys.all, (old) =>
        old?.filter((c) => c.id !== id),
      );
      return { prevData };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        qc.setQueryData(categoryKeys.all, context.prevData);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}
