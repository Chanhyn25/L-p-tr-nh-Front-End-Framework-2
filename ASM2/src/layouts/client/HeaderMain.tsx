import React from "react";
import { Link } from "react-router-dom";

const MainHeader: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-gray-300">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-gray-300">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/users" className="hover:text-gray-300">
                Users
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;
