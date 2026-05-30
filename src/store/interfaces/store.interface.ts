export interface Store {
  id: string;
  name: string;
  address?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
