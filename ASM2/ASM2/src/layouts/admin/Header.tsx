import React from "react";
import { Link } from "react-router-dom";

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/admin/users" className="hover:text-gray-400">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
