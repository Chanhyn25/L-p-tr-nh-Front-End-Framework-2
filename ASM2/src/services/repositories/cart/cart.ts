import { Cart } from "../../../interfaces/cart";
import { instance } from "../../api/config";

class CartService {
  public static async getCartItems(): Promise<Cart[]> {
    try {
      const response = await instance.get<Cart[]>("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart items", error);
      throw error;
    }
  }

  public static async getCartItemById(id: string | number): Promise<Cart> {
    try {
      const response = await instance.get<Cart>(`/cart/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cart item with ID ${id}`, error);
      throw error;
    }
  }

  public static async getCartItemsByUserId(userId: number): Promise<Cart> {
    try {
      const response = await instance.get<Cart>(`/cart?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cart items for user ID ${userId}`, error);
      throw error;
    }
  }

  public static async createCartItem(cartItem: Cart): Promise<Cart> {
    try {
      const response = await instance.post<Cart>("/cart", cartItem);
      return response.data;
    } catch (error) {
      console.error("Error creating cart item", error);
      throw error;
    }
  }

  public static async updateCartItem(
    id: number,
    updatedCartItem: Partial<Cart>
  ): Promise<Cart> {
    try {
      const response = await instance.put<Cart>(`/cart/${id}`, updatedCartItem);
      return response.data;
    } catch (error) {
      console.error(`Error updating cart item with ID ${id}`, error);
      throw error;
    }
  }

  public static async deleteCartItem(id: string | number): Promise<void> {
    try {
      await instance.delete(`/cart/${id}`);
    } catch (error) {
      console.error(`Error deleting cart item with ID ${id}`, error);
      throw error;
    }
  }
}

export default CartService;
