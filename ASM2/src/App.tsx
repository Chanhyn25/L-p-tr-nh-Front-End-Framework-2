import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/client/MainLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import HomePage from "./pages/client/HomePage";
import CategoriesPage from "./pages/client/CategoriesPage";
import CartPage from "./pages/client/CartPage";
import UsersPage from "./pages/client/UsersPage";
import LoginPage from "./pages/login/LoginPage";
import Dashboard from "./pages/admin/Dashboard";
import UserPage from "./pages/admin/users/user";
import UserCreatePage from "./pages/admin/users/user-add";
import UserEditPage from "./pages/admin/users/user-fix";
import ProductEdit from "./pages/admin/products/product-fix";
import ProductCreate from "./pages/admin/products/product-add";
import ProductPage from "./pages/admin/products/product";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/login" element={<LoginPage isLogin />} />
          <Route path="/register" element={<LoginPage />} />
        </Route>

        {/* Admin Layout Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />

          <Route path="/admin/users" element={<UserPage />} />
          <Route path="/admin/users/create" element={<UserCreatePage />} />
          <Route path="/admin/users/edit/:id" element={<UserEditPage />} />

          <Route path="/admin/products" element={<ProductPage />} />
          <Route path="/admin/products/create" element={<ProductCreate />} />
          <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
