import api from "./api";
import type {
  CategoryResponse,
  CategoryWithTodosResponse,
  CreateCategoryDto,
} from "@/types/category";

export const categoryService = {
  getAll: () =>
    api.get<CategoryResponse>("/categories").then((r) => r.data),

  getWithTodos: () =>
    api
      .get<CategoryWithTodosResponse>("/categories/with-todos")
      .then((r) => r.data),

  create: (dto: CreateCategoryDto) =>
    api.post<CategoryResponse>("/categories", dto).then((r) => r.data),
};
