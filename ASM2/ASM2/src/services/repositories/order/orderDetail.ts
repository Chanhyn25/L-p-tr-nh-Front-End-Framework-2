import { OrderDetails } from "../../../interfaces/order";
import { instance } from "../../api/config";

class OrderDetailService {
  public static async getOrderDetailsByOrderId(
    id_order: number
  ): Promise<OrderDetails[]> {
    try {
      const response = await instance.get<OrderDetails[]>(
        `/orderDetails?id_order=${id_order}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order details", error);
      throw error;
    }
  }

  public static async getOrderDetailById(id: number): Promise<OrderDetails> {
    try {
      const response = await instance.get<OrderDetails>(`/orderDetails/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order detail with ID ${id}`, error);
      throw error;
    }
  }

  public static async createOrderDetail(
    orderDetail: OrderDetails
  ): Promise<OrderDetails> {
    try {
      const response = await instance.post<OrderDetails>(
        "/orderDetails",
        orderDetail
      );
      return response.data;
    } catch (error) {
      console.error("Error creating order detail", error);
      throw error;
    }
  }

  public static async updateOrderDetail(
    id: number,
    updatedOrderDetail: Partial<OrderDetails>
  ): Promise<OrderDetails> {
    try {
      const response = await instance.put<OrderDetails>(
        `/orderDetails/${id}`,
        updatedOrderDetail
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order detail with ID ${id}`, error);
      throw error;
    }
  }

  public static async deleteOrderDetail(id: number): Promise<void> {
    try {
      await instance.delete(`/orderDetails/${id}`);
    } catch (error) {
      console.error(`Error deleting order detail with ID ${id}`, error);
      throw error;
    }
  }
}

export default OrderDetailService;
