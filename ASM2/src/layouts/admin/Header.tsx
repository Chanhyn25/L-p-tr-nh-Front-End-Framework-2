import React from "react";
import { Link } from "react-router-dom";

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-8 ">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Royal Sofas - Admin</h1>
        <nav>
          <ul className="flex space-x-10">
          <li>
              <Link to="/" className="hover:text-gray-300 flex items-center ">
              <ion-icon name="home-outline" style={{ fontSize: '24px', marginRight:'10px'}}></ion-icon> 
              Home
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="hover:text-gray-300 flex items-center ">
                <ion-icon name="person-circle-outline" style={{ fontSize: '24px', marginRight: '10px' }} ></ion-icon>User
              </Link>
            </li>

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
