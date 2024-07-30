export interface Order {
  id?: number;
  user_id: string | number;
  quantity: number;
  total: number;
}
