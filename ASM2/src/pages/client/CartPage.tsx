import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces/user";
import CartService from "../../services/repositories/cart/cart";
import ProductService from "../../services/repositories/products/Product";
import { Cart } from "../../interfaces/cart";
import { Product } from "../../interfaces/product";


const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCartItems = async (userId: number) => {
    try {
      const items = await CartService.getCartItemsByUserId(userId);
      const productPromises = items.map((item) =>
        ProductService.getProductById(item.product_id)
      );
      const products = await Promise.all(productPromises);

      const updatedCartItems = items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          ...product,
          quantity_cart: item.quantity,
          total_cart: item.total,
          id_cart: item.id,
        } as Cart & Product; // Kết hợp kiểu dữ liệu nếu cần
      });

      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to fetch cart items.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (id: number, change: number) => {
    try {
      const cartItem = await CartService.getCartItemById(id);

      if (cartItem.quantity + change <= 0) {
        alert("Cannot decrease quantity below 1");
        return;
      }

      const updatedCartItem: Cart = {
        ...cartItem,
        quantity: cartItem.quantity + change,
        total:
          (cartItem.quantity + change) * (cartItem.total / cartItem.quantity),
      };

      await CartService.updateCartItem(id, updatedCartItem);
      const userString = localStorage.getItem("user");
      const user: User | null = userString ? JSON.parse(userString) : null;
      if (user) {
        fetchCartItems(user.id);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleCheckout = () => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user) {
      // Điều hướng đến trang thanh toán
      navigate("/checkout");
    } else {
      // Nếu không có người dùng đăng nhập, điều hướng đến trang đăng nhập
      navigate("/login");
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (user?.role === 1) {
      navigate("/admin");
    } else if (!user) {
      navigate("/login");
    } else {
      fetchCartItems(user.id);
    }
  }, [navigate]);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.id_cart}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="form-checkbox" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={item.image || "default-image.jpg"} // Placeholder if image URL is not available
                      alt={item.name}
                      className="w-24 h-24 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="button"
                        onClick={() => handleQuantityChange(item.id_cart, -1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-16 text-center border border-gray-300 rounded"
                        value={item.quantity_cart}
                        readOnly
                      />
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="button"
                        onClick={() => handleQuantityChange(item.id_cart, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.total_cart}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Your cart is empty
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="5"
                className="px-6 py-3 text-right text-sm font-medium text-gray-900"
              >
                <strong>Total:</strong>
              </td>
              <td className="px-6 py-3 text-sm font-medium text-gray-900">
                <strong>
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.total_cart, 0)
                    .toFixed(2)}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="text-right mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
