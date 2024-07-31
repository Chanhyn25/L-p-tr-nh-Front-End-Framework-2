import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar: React.FC = () => {
  return (
    <nav className="bg-gray-500 p-4">
      <ul className="flex justify-between bg-gray-900 p-2 rounded">
        <li className="text-center flex-1">
          <Link
            to="/admin"
            className="block p-2 text-white hover:bg-gray-400 rounded"
          >
            Dashboard
          </Link>
        </li>
        <li className="text-center flex-1">
          <Link
            to="/admin/users"
            className="block p-2 text-white hover:bg-gray-400 rounded"
          >
            Users
          </Link>
        </li>
        <li className="text-center flex-1">
          <Link
            to="/admin/products"
            className="block p-2 text-white hover:bg-gray-400 rounded"
          >
            Products
          </Link>
        </li>
        <li className="text-center flex-1">
          <Link
            to="/admin/orders"
            className="block p-2 text-white hover:bg-gray-400 rounded"
          >
            Orders
          </Link>
        </li>
        <li className="text-center flex-1">
          <Link
            to="/logout"
            className="block p-2 text-white hover:bg-gray-400 rounded"
          >
            Log Out
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;
