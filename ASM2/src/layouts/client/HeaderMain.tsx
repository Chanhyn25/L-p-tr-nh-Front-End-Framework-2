import React from "react";
import { Link } from "react-router-dom";

const MainHeader: React.FC = () => {
  return (
    <header className="bg-black text-white p-8 ">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Royal Sofas</h1>
        <nav>
          <ul className="flex space-x-10">
            <li>
              <Link to="/" className="hover:text-gray-300 flex items-center ">
              <ion-icon name="home-outline" style={{ fontSize: '24px', marginRight:'10px'}}></ion-icon> 
              Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-gray-300 flex items-center ">
              <ion-icon name="file-tray-full-outline" style={{ fontSize: '24px', marginRight:'10px' }}></ion-icon> Categories
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-gray-300 flex items-center ">
              <ion-icon name="cart-outline" style={{ fontSize: '24px' , marginRight:'10px'}}></ion-icon> Cart
              </Link>
            </li>
            <li>
              <Link to="/users" className="hover:text-gray-300 flex items-center ">
              <ion-icon name="person-circle-outline" style={{ fontSize: '24px' , marginRight:'10px'}} ></ion-icon> 
              </Link>
            </li>
            {/* <li>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;
