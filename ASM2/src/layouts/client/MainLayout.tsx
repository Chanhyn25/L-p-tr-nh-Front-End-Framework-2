import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import MainHeader from "./HeaderMain";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-1 p-4">
        <Outlet /> {/* This renders the nested routes */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
