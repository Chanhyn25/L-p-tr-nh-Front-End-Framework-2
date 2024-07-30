import React from "react";

const HomePage: React.FC = () => {
  return ( 
    <div className="relative h-screen w-full rounded-lg ">
      <video className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" autoPlay loop muted>
        <source src="https://nordic.vn/wp-content/uploads/2023/09/31-8-2023-web.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 text-center text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4  rounded-lg">Welcome to Royal Sofas</h1>
        <p className="text-lg  rounded-lg">
          Explore our site to find the best products and services. Browse through
          categories, manage your cart, and more.
        </p>
      </div>
      <div className="absolute inset-0 bg-black opacity-50  rounded-lg"></div>
    </div>
  );
};

export default HomePage;
