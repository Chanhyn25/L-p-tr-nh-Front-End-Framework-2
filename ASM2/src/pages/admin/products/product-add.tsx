// src/pages/ProductCreate.tsx
import React, { useEffect, useState } from "react";
import { Product } from "../../../interfaces/product";
import { useNavigate } from "react-router-dom";
import ProductService from "../../../services/repositories/products/Product";
import { User } from "../../../interfaces/user";

const ProductCreate: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const nav = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
     
    } else if(!user) {
      nav("/login");
    }
  }, [nav]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newProduct: Product = {
        id: Date.now(),
        name,
        image,
        description,
        quantity,
        price,
      };
      await ProductService.createProduct(newProduct);
      setSuccess("Product created successfully");
      setName("");
      setImage("");
      setDescription("");
      setQuantity(0);
      setPrice(0);
      nav("/admin/products");
    } catch (error) {
      setError("Failed to create product");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            Image URL:
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
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
          className="bg-black-500 text-white px-4 py-2 rounded "
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
