import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-200 p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin"
              className="block p-2 text-gray-700 hover:bg-gray-300 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="block p-2 text-gray-700 hover:bg-gray-300 rounded"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className="block p-2 text-gray-700 hover:bg-gray-300 rounded"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className="block p-2 text-gray-700 hover:bg-gray-300 rounded"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="block p-2 text-gray-700 hover:bg-gray-300 rounded"
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
