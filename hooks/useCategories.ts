import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categories";
import type { CreateCategoryDto } from "@/types/category";

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
