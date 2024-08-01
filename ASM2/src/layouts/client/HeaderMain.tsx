import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Category } from "../../interfaces/category";
import CategoryService from "../../services/repositories/category/category";

const MainHeader: React.FC = () => {
  const [category, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await CategoryService.getCategorys();

        setCategory(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const handleCategoriesToggle = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  return (
    <header className="bg-black text-white p-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Royal Sofas</h1>
        <nav>
          <ul className="flex space-x-10 items-center">
            <li>
              <Link to="/" className="hover:text-gray-300 flex items-center">
                <ion-icon name="home-outline" style={{ fontSize: '24px', marginRight: '10px' }}></ion-icon>
                Home
              </Link>
            </li>
            <li className="relative">
              <button
                onClick={handleCategoriesToggle}
                className="flex items-center bg-black hover:text-gray-300 focus:outline-none"
              >
                <ion-icon name="file-tray-full-outline" style={{ fontSize: '24px', marginRight: '10px' }}></ion-icon>
                Categories
                <ion-icon name={isCategoriesOpen ? "chevron-up-outline" : "chevron-down-outline"} style={{ fontSize: '16px', marginLeft: '10px' }}></ion-icon>
              </button>
              {isCategoriesOpen && (

                <ul className="absolute left-0 mt-2 w-48 bg-black text-white rounded shadow-lg z-10">
                  {category.map((catego) => (
                    <li key={catego.id} onClick={handleCategoriesToggle} className="hover:bg-gray-800">
                      <Link to={`/categories/${catego.id}`} className="block px-4 py-2">
                        {catego.name}
                      </Link>
                    </li>
                  ))}

                </ul>
              )}
            </li>
            <li>
              <Link to="/cart" className="hover:text-gray-300 flex items-center">
                <ion-icon name="cart-outline" style={{ fontSize: '24px', marginRight: '10px' }}></ion-icon>
                Cart
              </Link>
            </li>
            <li>
              <Link to="/users" className="hover:text-gray-300 flex items-center">
                <ion-icon name="person-circle-outline" style={{ fontSize: '24px', marginRight: '10px' }}></ion-icon>
              </Link>
            </li>
          </ul>
        </nav>
      </div >
    </header >
  );
};

export default MainHeader;
