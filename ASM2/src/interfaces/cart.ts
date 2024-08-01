export interface Cart {
  id: number;
  user_id: string | number;
  product_id: number;
  quantity: number;
  total: number;
}
