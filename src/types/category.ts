export type CategoryResponse = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type CreateCategoryDto = {
  name: string;
  description: string;
  color: string;
};
