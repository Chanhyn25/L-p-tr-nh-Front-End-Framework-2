import React, { useEffect, useState } from "react";
import { Product } from "../../interfaces/product";
import ProductService from "../../services/repositories/products/Product";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../interfaces/user";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      nav("/admin");
    }
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

  return (
    <div className="">
      <div className="relative h-screen w-full rounded-lg">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
          autoPlay
          loop
          muted
        >
          <source
            src="https://nordic.vn/wp-content/uploads/2023/09/31-8-2023-web.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 text-center text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 rounded-lg">
            Welcome to Royal Sofas
          </h1>
          <p className="text-lg rounded-lg">
            Explore our site to find the best products and services. Browse
            through categories, manage your cart, and more.
          </p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
      </div>

      <p className=" mt-10 text-4xl ">
        {" "}
        <>New Arrivals</>{" "}
      </p>
      <div className="mt-8 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-black rounded-[5px] shadow p-4 product-card"
          >
            <Link to={`/productDetail/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  marginBottom: 16,
                }}
                className="rounded-[5px]"
              />
            </Link>{" "}
            <h1 className="text-xl font-bold mb-2 text-center text-white">
              {product.name}
            </h1>
            <p className="mb-2 text-white">{product.description}</p>
            <p className="text-white">
              Price: <b>${product.price}</b>
            </p>
            <p className="text-white">Quantity: {product.quantity}</p>
            <div className="flex justify-center mt-2">
              <div className="flex justify-center items-center space-x-2 mt-2 bg-white rounded-[5px] w-40 h-10">
                <Link
                  to={`/productDetail/${product.id}`}
                  className="hover:text-gray-300 flex items-center"
                >
                  <button className="bg-white text-black px-5 py-1 rounded-[15px]">
                    View detail
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
