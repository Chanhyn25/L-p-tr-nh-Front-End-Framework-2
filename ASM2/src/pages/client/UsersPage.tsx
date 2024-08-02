import React, { useEffect, useState } from "react";
import { User } from "../../interfaces/user";
import { Link, useNavigate } from "react-router-dom";
import CartService from "../../services/repositories/cart/cart";
import UserService from "../../services/repositories/users/UserService";
import OrderService from "../../services/repositories/order/order";
import axios from "axios";

const UsersPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    email: "",
    name: "",
    phone: "",
    address: "",
    password: "",
    confirmPass: "",
    role: 0,
    avatar: "",
  });
  const [orders, setOrders] = useState<any[]>([]); // Replace with appropriate type

  const nav = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userString = localStorage.getItem("user");
      const user: User | null = userString ? JSON.parse(userString) : null;

      if (user) {
        try {
          const userData = await UserService.getUserById(user.id);
          setUser(userData);
          setFormData(userData);

          // Fetch orders
          const ordersData = await OrderService.getOrderByUser_id(user.id);
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data.");
        } finally {
          setIsLoading(false);
        }
      } else {
        nav("/login");
      }
    };

    fetchUserData();
  }, [nav]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData1 = new FormData();
      formData1.append("file", formData.avatar);
      formData1.append("upload_preset", "asm-react");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhi3ud9d0/image/upload",
        formData1,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      formData.avatar = response.data.secure_url;
      await UserService.updateUser(formData.id, formData);
      setUser(formData);
      localStorage.setItem("user", JSON.stringify(formData));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Failed to update user data.");
    }
  };

  const handleViewOrderDetails = (orderId: number) => {
    nav(`/orders/${orderId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="bg-white p-4 rounded shadow-md mb-6">
        {user ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="flex items-center mb-4">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full border border-gray-300"
              />
              {editMode && (
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="ml-4"
                />
              )}
            </div>
            {editMode ? (
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={!!user.name}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone:
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={!!user.phone}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Address:
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={!!user.address}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-gray-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-4 py-2 ml-4 bg-gray-300 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
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
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-5 py-2 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-gray-700"
                >
                  Edit
                </button>
                <Link
                  to="/logout"

                >
                  <button

                    className="inline-flex items-center ml-2 px-5 py-2 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-gray-700"
                  >
                    Log Out
                  </button>
                </Link>

              </div>
            )}
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Order History</h2>
      <div className="bg-white p-4 rounded shadow-md">
        {orders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewOrderDetails(order.id)}
                      className="inline-flex items-center px-4 py-2 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-gray-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;

