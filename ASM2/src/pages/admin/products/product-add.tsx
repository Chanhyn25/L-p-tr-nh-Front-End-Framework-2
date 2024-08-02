import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ProductService from "../../../services/repositories/products/Product";
import { Product } from "../../../interfaces/product";
import { User } from "../../../interfaces/user";
import { useNavigate } from "react-router-dom";
import { productSchema } from "../../../utils/valtidation";


const ProductCreate: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
  });

  const nav = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;
    if (!user || user.role !== 1) {
      nav("/login");
    }
  }, [nav]);

  const onSubmit = async (data: Product) => {
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("name", data.name);
      formData.append("description", data.description || '');
      formData.append("quantity", String(data.quantity));
      formData.append("price", String(data.price));

      await ProductService.createProduct(formData);
      reset(); // Reset the form after successful submission
      nav("/admin/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      // Create a URL for the image to use as preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            {...register("name")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded px-3 py-2 w-full"
          />
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Preview"
                className="border rounded w-48 h-48 object-cover"
              />
            </div>
          )}
          {errors.image && <p className="text-red-500">{errors.image.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            {...register("description")}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity:
          </label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="border rounded px-3 py-2 w-full"
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-black-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
