export type User = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  providerUid: string;
  role: string;
};

export type UserProfileResponse = User;

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role?: string;
};
