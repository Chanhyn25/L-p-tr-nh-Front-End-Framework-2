import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../../services/repositories/users/UserService";
import { User } from "../../../interfaces/user";

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id) {
          const fetchedUser = await UserService.getUserById(id);
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
        confirmPass: password || user?.confirmPass || "",
        role: role || "0",
      };
      if (id) {
        await UserService.updateUser(id, updatedUser);
        setSuccess("User updated successfully");
        setError(null);
        navigate("/admin/users");
      }
      setSuccess("User updated successfully");
      setError(null);
      navigate("/admin/users"); // Redirect to the users list or any other page
    } catch (error) {
      setError("Failed to update user");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
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
            value={user.email || ""} // Ensure value is a string
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
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="0">User</option>
            <option value="1">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UserEditPage;
