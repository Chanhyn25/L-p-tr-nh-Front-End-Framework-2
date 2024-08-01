import { Category } from "../../../interfaces/category";
import { instance } from "../../api/config";

class CategoryService {
    public static async getCategorys(): Promise<Category[]> {
        try {
            const response = await instance.get<Category[]>("/categorys");
            return response.data;
        } catch (error) {
            console.error("Error fetching orders", error);
            throw error;
        }
    }
}
export default CategoryService;