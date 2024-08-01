import React, { useEffect, useState } from "react";
import { Product } from "../../interfaces/product";
import ProductService from "../../services/repositories/products/Product";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getProducts();
        const reversedProducts = response.reverse();
        const top4LatestProducts = reversedProducts.slice(0, 8);
        setProducts(top4LatestProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleBuyNow = (product: Product) => {
    console.log(`Buying product: ${product.name}`);
  };

  const handleAddToCart = (product: Product) => {
    console.log(`Adding product to cart: ${product.name}`);
  };

  return (
    <div>
      <div className="relative h-screen w-full rounded-lg">
        <video className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" autoPlay loop muted>
          <source src="https://nordic.vn/wp-content/uploads/2023/09/31-8-2023-web.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 text-center text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 rounded-lg">Welcome to Royal Sofas</h1>
          <p className="text-lg rounded-lg">
            Explore our site to find the best products and services. Browse through
            categories, manage your cart, and more.
          </p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
      </div>

      {/* Phần hiển thị sản phẩm */}
      <div className="mt-8 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-grey rounded-lg shadow p-4 ">
            <img src={product.image} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 16 }} />
            <h2 className="text-xl font-bold mb-2 text-center ">{product.name}</h2>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-red-600 font-semibold">Price: ${product.price}</p>
            <p className="text-red-900">Quantity: {product.quantity}</p>
            <div className="flex justify-center items-center space-x-2 mt-2">
              <button
                className="bg-pink-300 text-white px-5 py-1 text-lg rounded"
                onClick={() => handleBuyNow(product)}
              >
                Mua ngay
              </button>
              <button
                className="text-pink-500 flex items-center justify-center p-1"
                onClick={() => handleAddToCart(product)}
              >
                <ion-icon name="cart-outline" size="small"></ion-icon>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
