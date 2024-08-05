// src/pages/ProductEdit.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../../services/repositories/products/Product";
import { User } from "../../../interfaces/user";
import axios from "axios";

const ProductEdit: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      const fetchProduct = async () => {
        if (id) {
          try {
            const product = await ProductService.getProductById(Number(id));
            setName(product.name);
            setImagePreview(product.image);
            setDescription(product.description);
            setQuantity(product.quantity);
            setPrice(product.price);
          } catch (error) {
            console.error("Error fetching product:", error);
            setError("Failed to fetch product");
          }
        }
      };

      fetchProduct();
    } else if (!user) {
      nav("/login");
    } else {
      nav("/");
    }
  }, [id, nav]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("quantity", quantity.toString());
      formData.append("price", price.toString());

      if (image) {
        const formData1 = new FormData();
        formData1.append("file", image);
        formData1.append("upload_preset", "asm-react");
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dhi3ud9d0/image/upload",
          formData1,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        formData.append("image", response.data.secure_url);
      }

      await ProductService.updateProduct(Number(id), formData);
      setSuccess("Product updated successfully");
      nav("/admin/products");
    } catch (error) {
      setError("Failed to update product");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
            Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded px-3 py-2 w-full"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mt-2 border rounded max-w-full h-auto"
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity:
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
            required
          />
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

export default ProductEdit;
