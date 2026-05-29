import type { CategoryResponse } from "./category";
import type { CommentResponse } from "./comment";

export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export type TodoResponse = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string;
  categories: CategoryResponse[];
};

export type TodoDetailResponse = TodoResponse & {
  comments: CommentResponse[];
};

export type CreateTodoDto = {
  title: string;
  description: string;
  dueDate: string;
  priority: TodoPriority;
  categories: string[];
};

export type UpdateTodoDto = {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TodoPriority;
  categories?: string[];
  completed?: boolean;
};
