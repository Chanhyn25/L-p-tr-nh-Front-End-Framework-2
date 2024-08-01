import { Product } from "../../../interfaces/product";
import { instance } from "../../api/config";

class ProductService {
  // Get all products
  public static async getProducts(): Promise<Product[]> {
    try {
      const response = await instance.get<Product[]>("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products", error);
      throw error;
    }
  }

  // Get a single user by ID
  public static async getProductById(id: number): Promise<Product> {
    try {
      const response = await instance.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}`, error);
      throw error;
    }
  }
  public static async getProductsByCategory(id: number): Promise<Product[]> {
    try {
      const response = await instance.get<Product[]>(`/products?category=${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}`, error);
      throw error;
    }
  }
  // Create a new user
  public static async createProduct(user: Product): Promise<Product> {
    try {
      const response = await instance.post<Product>("/products", user);
      return response.data;
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }

  // Update an existing user
  public static async updateProduct(
    id: number,
    updatedUser: Partial<Product>
  ): Promise<Product> {
    try {
      const response = await instance.put<Product>(
        `/products/${id}`,
        updatedUser
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}`, error);
      throw error;
    }
  }

  // Delete a user
  public static async deleteProduct(
    id: string | number | undefined
  ): Promise<void> {
    try {
      await instance.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}`, error);
      throw error;
    }
  }
}

export default ProductService;
