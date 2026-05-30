export interface Store {
  id: string;
  name: string;
  address?: string;
  created_at: Date | string;
  updated_at: Date | string;
}
