import { Order } from "../../../interfaces/order";
import { instance } from "../../api/config";

class OrderService {
  public static async getOrders(): Promise<Order[]> {
    try {
      const response = await instance.get<Order[]>("/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders", error);
      throw error;
    }
  }

  public static async getOrderById(id: number): Promise<Order> {
    try {
      const response = await instance.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}`, error);
      throw error;
    }
  }

  public static async getOrderByUser_id(id: number): Promise<Order[]> {
    try {
      const response = await instance.get<Order[]>(`/orders?user_id=${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}`, error);
      throw error;
    }
  }

  public static async createOrder(order: Order): Promise<Order> {
    try {
      const response = await instance.post<Order>("/orders", order);
      return response.data;
    } catch (error) {
      console.error("Error creating order", error);
      throw error;
    }
  }

  public static async updateOrder(
    id: number,
    updatedOrder: Partial<Order>
  ): Promise<Order> {
    try {
      const response = await instance.put<Order>(`/orders/${id}`, updatedOrder);
      return response.data;
    } catch (error) {
      console.error(`Error updating order with ID ${id}`, error);
      throw error;
    }
  }

  public static async deleteOrder(id: number): Promise<void> {
    try {
      await instance.delete(`/orders/${id}`);
    } catch (error) {
      console.error(`Error deleting order with ID ${id}`, error);
      throw error;
    }
  }
}

export default OrderService;
