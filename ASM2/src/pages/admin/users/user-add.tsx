import React, { useEffect, useState } from "react";
import UserService from "../../../services/repositories/users/UserService";
import { User } from "../../../interfaces/user";
import { useNavigate } from "react-router-dom";

const UserCreatePage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const nav = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
    } else if (!user) {
      nav("/login");
    }
  }, [nav]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newUser: User = {
        id: Number(Date.now()),
        email,
        name,
        password,
        confirmPass,
        role,
      };

      await UserService.createUser(newUser);
      setSuccess("User created successfully");
      setPassword("");
      setEmail("");
    } catch (error) {
      setError("Failed to create user");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
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
            className="border rounded px-3 py-2 w-full"
            required
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
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="0">User</option>
            <option value="1">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-black-500 text-white px-4 py-2 rounded  hover:bg-gray-600"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default UserCreatePage;
