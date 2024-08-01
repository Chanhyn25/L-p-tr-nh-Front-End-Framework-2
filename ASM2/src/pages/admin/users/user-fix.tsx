import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../../services/repositories/users/UserService";
import { User } from "../../../interfaces/user";

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // `id` là chuỗi
  const nav = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      const fetchUser = async () => {
        try {
          const numericId = id ? parseInt(id, 10) : undefined; // Chuyển đổi id từ chuỗi sang số
          if (numericId !== undefined) {
            const fetchedUser = await UserService.getUserById(numericId);
            setUser(fetchedUser);
            if (fetchedUser) {
              setRole(fetchedUser.role?.toString() || "0");
            }
          }
        } catch (error) {
          setError("Failed to fetch user");
        }
      };

      fetchUser();
    } else if (!user) {
      nav("/login");
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password && password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }
    try {
      const updatedUser: User = {
        ...user!,
        password: password || user?.password || "",
        role: role || "0",
      };
      const numericId = id ? parseInt(id, 10) : undefined;
      if (numericId !== undefined) {
        await UserService.updateUser(numericId, updatedUser);
        setSuccess("User updated successfully");
        setError(null);
        nav("/admin/users");
      }
    } catch (error) {
      setError("Failed to update user");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit User</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            value={user.email || ""} // Đảm bảo giá trị là chuỗi
            readOnly
            className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            value={user.name || ""} // Đảm bảo giá trị là chuỗi
            readOnly
            className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full "
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password:
          </label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="border rounded px-3 py-2 w-full "
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-3 py-2 w-full "
            required
          >
            <option value="0">User</option>
            <option value="1">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-black-500 text-white px-4 py-2 rounded hover:bg-gray-600 "
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UserEditPage;
