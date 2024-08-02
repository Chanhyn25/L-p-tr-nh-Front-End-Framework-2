import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserService from "../../../services/repositories/users/UserService";
import { User } from "../../../interfaces/user";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Define Zod schema for validation
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits long"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  confirmPass: z.string().min(6, "Confirm Password must be at least 6 characters long").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  role: z.enum(["0", "1"], "Role is required"),
}).refine((data) => data.password === data.confirmPass || !data.password, {
  message: "Passwords must match",
  path: ["confirmPass"],
});

const UserUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const nav = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;
    if (!user || user.role !== 1) {
      nav("/login");
    }
  }, [nav]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserService.getUserById(id);
        setValue("email", userData.email);
        setValue("name", userData.name);
        setValue("phone", userData.phone);
        setValue("address", userData.address);
        setValue("role", userData.role);
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
          setValue("avatar", userData.avatar);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [id, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: User) => {
    try {
      if (data.avatar && data.avatar.startsWith("data:image")) {
        const formData = new FormData();
        formData.append("file", data.avatar);
        formData.append("upload_preset", "asm-react");
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dhi3ud9d0/image/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        data.avatar = response.data.secure_url;
      }

      await UserService.updateUser(id, data);
      nav("/admin/users");
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center mb-4">
          <img
            src={avatarPreview || "default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="ml-4"
            accept="image/*"
          />
        </div>
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
          <label className="block text-sm font-medium text-gray-700">Phone:</label>
          <input
            type="text"
            {...register("phone")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address:</label>
          <input
            type="text"
            {...register("address")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            {...register("password")}
            className="border rounded px-3 py-2 w-full"
            placeholder="Leave blank to keep current password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
          <input
            type="password"
            {...register("confirmPass")}
            className="border rounded px-3 py-2 w-full"
            placeholder="Leave blank to keep current password"
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
          Update
        </button>
      </form>
    </div>
  );
};

export default UserUpdatePage;
