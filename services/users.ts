import api from "./api";
import type { User, CreateUserDto } from "@/types/user";

export const userService = {
  register: (dto: CreateUserDto) =>
    api.post<User>("/users", dto).then((r) => r.data),

  getProfile: () =>
    api.get<User>("/users/me").then((r) => r.data),
};
