export interface Order {
  id?: number;
  user_id: number;
  quantity: number;
  total: number;
  status: number;
}

export interface OrderDetails {
  id?: string | number;
  id_order?: number;
  product_id: number;
  quantity: number;
  total: number;
}
