import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./Header";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4">
          <Outlet /> {/* This renders the nested routes */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
