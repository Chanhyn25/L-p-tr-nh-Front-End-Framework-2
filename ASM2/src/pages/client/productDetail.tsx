import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Cart } from "../../interfaces/cart";
import { User } from "../../interfaces/user";
import CartService from "../../services/repositories/cart/cart";
import { common } from "@mui/material/colors";

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: number;
  price: number;
  image: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const nav = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      nav("/admin");
    }
    const fetchProduct = async () => {
      const response = await fetch(`http://localhost:3000/products/${id}`);
      const data: ProductDetail = await response.json();
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const handleAddToCart = async (product: ProductDetail) => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (!user) {
      console.error("User not found. Please log in.");
      return;
    }

    try {
      const cartItems: Cart[] = await CartService.getCartItemsByUserId(user.id);

      const existingCartItem = cartItems.find(
        (item) => item.product_id === product.id
      );

      if (existingCartItem) {
        const updatedCartItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
          total: (existingCartItem.quantity + 1) * product.price,
        };

        await CartService.updateCartItem(updatedCartItem.id, updatedCartItem);
      } else {
        const newCartItem: Cart = {
          id: Date.now(),
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          total: product.price,
        };

        await CartService.createCartItem(newCartItem);
      }

      alert("Add to cart successfully");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={`../${product.image}`}
        alt={product.name}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-gray-700 mb-2">Quantity: {product.quantity}</p>
      <p className="text-gray-700 mb-2">Category: {product.category}</p>
      <p className="text-gray-900 font-semibold">Price: ${product.price}</p>
      <div className="flex justify-center mt-2">
        <div className="flex justify-center items-center space-x-2 mt-2 bg-black rounded-[5px] w-40 h-10">
          <button
            className="bg-black text-white px-5 py-1 rounded-[15px]"
            onClick={() => handleAddToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
