import type { TodoResponse } from "./todo";

export type CategoryResponse = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type CategoryWithTodosResponse = CategoryResponse & {
  todos: TodoResponse[];
};

export type CreateCategoryDto = {
  name: string;
  description: string;
  color: string;
};
