export interface OrderDetails {
    id?: string | number;
    user_id: string | number;
    product_id: number;
    quantity: number;
    total: number;
}
