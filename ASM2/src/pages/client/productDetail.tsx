import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Cart } from "../../interfaces/cart";
import { User } from "../../interfaces/user";
import CartService from "../../services/repositories/cart/cart";

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: number;
  price: number;
  image: string;
}

interface SimilarProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [quantity, setQuantity] = useState(1);
  const nav = useNavigate();
  const userString = localStorage.getItem("user");

  const user: User | null = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (user?.role === 1) {
      nav("/admin");
    }

    const fetchProduct = async () => {
      const response = await fetch(`http://localhost:3000/products/${id}`);
      const data: ProductDetail = await response.json();
      setProduct(data);

      // Fetch similar products
      const similarResponse = await fetch(`http://localhost:3000/products?category=${data.category}`);
      const similarData: SimilarProduct[] = await similarResponse.json();
      setSimilarProducts(similarData);
    };

    fetchProduct();
  }, [id, nav]);

  if (!product) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const handleAddToCart = async (product: ProductDetail) => {
    if (user?.role === 1) {
      nav("/admin");
    } else if (!user) {
      nav("/login");
    } else {
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

        let totalQuantity = 0;
        if (existingCartItem) {
          totalQuantity = existingCartItem.quantity + quantity;
        } else {
          totalQuantity = quantity;
        }

        if (totalQuantity > 5) {
          alert("You cannot add more than 5 items of this product to the cart.");
          return;
        }

        if (existingCartItem) {
          const updatedCartItem = {
            ...existingCartItem,
            quantity: totalQuantity,
            total: totalQuantity * product.price,
          };

          await CartService.updateCartItem(updatedCartItem.id, updatedCartItem);
        } else {
          const newCartItem: Cart = {
            id: Date.now(),
            user_id: user.id,
            product_id: product.id,
            quantity: quantity,
            total: quantity * product.price,
          };

          await CartService.createCartItem(newCartItem);
        }

        alert("Add to cart successfully");
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

  const handleIncrease = () => setQuantity((prev) => Math.min(prev + 1, Math.min(product.quantity, 5)));
  const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-900 font-semibold text-xl">Price: ${product.price}</p>
        <div className="flex justify-between items-center mb-2">
          <div className="option_production-number">
            <span className="text-gray-700 font-semibold text-xl">Quantity</span>
            <div className="input-group flex items-center">
              <button
                type="button"
                className="btn qty-down bg-gray-300 p-2 rounded-l"
                onClick={handleDecrease}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-dash-lg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                  ></path>
                </svg>
              </button>
              <input
                type="text"
                id="Quantity"
                className="form-control quantity text-center w-12"
                value={quantity}
                disabled
                placeholder="Số lượng"
              />
              <button
                type="button"
                className="btn qty-up bg-gray-300 p-2 rounded-r"
                onClick={handleIncrease}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-lg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="text-gray-700 mb-2">
          <p className="text-gray-900 text-2xl">Description</p>
          {product.description}
        </div>
        <div className="flex justify-center mt-2 mb-2">
          <div className="flex justify-center items-center space-x-2 mt-2 mb-2 bg-black rounded-[5px] w-full h-10">
            <button
              className="bg-black text-white px-5 py-1 rounded-[15px]"
              onClick={() => handleAddToCart(product)}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="mt-10 mb-3 text-4xl">Similar Products</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {similarProducts.slice(0, 9).map((similarProduct) => (
            <div
              key={similarProduct.id}
              className="bg-black rounded-[5px] shadow p-4 product-card"
            >
              <Link to={`/productDetail/${similarProduct.id}`}>
                <img
                  src={similarProduct.image}
                  alt={similarProduct.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              </Link>
              <Link to={`/productDetail/${similarProduct.id}`}>
                <h1 className="text-xl font-bold mb-2 text-center text-white">
                  {similarProduct.name}
                </h1>
              </Link>
              <p className="text-white text-center font-semibold">
                Price: ${similarProduct.price}
              </p>
              <div className="flex justify-center items-center space-x-2 mt-4 mb-3 bg-white rounded-[5px] w-30 h-3">
                <button
                  className="bg-white w-full text-black px-5 py-1 rounded-[5px]"
                  onClick={() => handleAddToCart(similarProduct as ProductDetail)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
