import { User } from "../../../interfaces/user";
import { instance } from "../../api/config";

class UserService {
  // Get all users
  public static async getUsers(): Promise<User[]> {
    try {
      const response = await instance.get<User[]>("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users", error);
      throw error;
    }
  }

  // Get a single user by ID
  public static async getUserById(id: number): Promise<User> {
    try {
      const response = await instance.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}`, error);
      throw error;
    }
  }

  // Create a new user
  public static async createUser(user: User): Promise<User> {
    try {
      const response = await instance.post<User>("/users", user);
      return response.data;
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }

  // Update an existing user
  public static async updateUser(
    id: number,
    updatedUser: Partial<User>
  ): Promise<User> {
    try {
      const response = await instance.put<User>(`/users/${id}`, updatedUser);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}`, error);
      throw error;
    }
  }

  // Delete a user
  public static async deleteUser(
    id: string | number | undefined
  ): Promise<void> {
    try {
      await instance.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}`, error);
      throw error;
    }
  }
}

export default UserService;
