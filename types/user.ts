export type User = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  providerUid: string;
  role: string;
};

export type UserProfileResponse = {
  id: string;
  name: string;
  email: string;
  providerUid: string;
  role: string;
};

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role?: string;
};
