import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./Header";
import Footer from "./Footer";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <AdminSidebar />
      <main className="flex-1 p-4">
        <Outlet /> 
      </main>
      <Footer/>
    </div>
  );
};

export default AdminLayout;
