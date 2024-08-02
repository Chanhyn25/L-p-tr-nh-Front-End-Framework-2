import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserService from "../../../services/repositories/users/UserService";
import { User } from "../../../interfaces/user";
import { useNavigate } from "react-router-dom";

// Define Zod schema for validation
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPass: z.string().min(6, "Confirm Password must be at least 6 characters long"),
  role: z.enum(["0", "1"], "Role is required"),
}).refine((data) => data.password === data.confirmPass, {
  message: "Passwords must match",
  path: ["confirmPass"],
});

const UserCreatePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const nav = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;
    if (!user || user.role !== 1) {
      nav("/login");
    }
  }, [nav]);

  const onSubmit = async (data: User) => {
    try {
      await UserService.createUser(data);
      nav("/admin/users");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            {...register("email")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            {...register("name")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            {...register("password")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
          <input
            type="password"
            {...register("confirmPass")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.confirmPass && <p className="text-red-500 text-sm">{errors.confirmPass.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role:</label>
          <select
            {...register("role")}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="0">User</option>
            <option value="1">Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default UserCreatePage;
