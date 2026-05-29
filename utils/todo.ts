import type { TodoPriority } from "@/types/todo";

export const priorityColor: Record<TodoPriority, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-green-500",
};

export const priorityLabel: Record<TodoPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};