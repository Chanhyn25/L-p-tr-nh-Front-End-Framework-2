import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces/user";
import CartService from "../../services/repositories/cart/cart";
import ProductService from "../../services/repositories/products/Product";
import UserService from "../../services/repositories/users/UserService";
import { Cart, Product } from "../../interfaces"; // Import các kiểu dữ liệu nếu có
import OrderService from "../../services/repositories/order/order";
import OrderDetailService from "../../services/repositories/order/orderDetail";

const CheckoutPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const userString = localStorage.getItem("user");
      const userId: number | null = userString
        ? JSON.parse(userString)?.id
        : null;
      if (userId) {
        const fetchedUser = await UserService.getUserById(userId);
        setUser(fetchedUser);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user information.");
    }
  };

  const fetchCartItems = async () => {
    try {
      const userString = localStorage.getItem("user");
      const userId: number | null = userString
        ? JSON.parse(userString)?.id
        : null;
      if (userId) {
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
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to fetch cart items.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    const userString = localStorage.getItem("user");
    const user_: User | null = userString ? JSON.parse(userString) : null;
    if (user_?.name || user_?.phone || user_?.address) {
      const order = {
        id: Date.now(),
        user_id: user_.id,
        quantity: cartItems.reduce((acc, item) => acc + item.quantity_cart, 0),
        total: cartItems.reduce((acc, item) => acc + item.total_cart, 0),
        status: 1, // Status for new orders
      };
      await OrderService.createOrder(order);
      const orderDetails = cartItems.map((item) => ({
        id_order: order.id,
        product_id: item.id,
        quantity: item.quantity_cart,
        total: item.total_cart,
      }));
      orderDetails.map(async (item) => {
        await OrderDetailService.createOrderDetail(item);
      });

      const cart = await CartService.getCartItemsByUserId(user_.id);
      cart.map((item) => {
        ProductService.updateProductQuantity(item.product_id, item.quantity);
        CartService.deleteCartItem(item.id);
      });
      alert("Đặt hàng thành công");
      navigate("/users");
    } else {
      alert("Vui lòng vào trang user cập nhật thông tin");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCartItems();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Billing Information</h2>
          {user ? (
            <div className="bg-white p-4 rounded shadow-md">
              <p className="mb-2">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> {user.phone}
              </p>
              <p className="mb-2">
                <strong>Address:</strong> {user.address}
              </p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow-md">
              <p>Loading user information...</p>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
          <div className="bg-white p-4 rounded shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity_cart}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                        ${item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.total_cart}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No items in cart
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="3"
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
        </div>
      </div>
      <div className="text-right mt-4">
        <button
          className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-600 "
          onClick={handleConfirmOrder}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
