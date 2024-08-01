import React, { useEffect } from "react";
import { User } from "../../interfaces/user";
import { useNavigate } from "react-router-dom";

const UsersPage: React.FC = () => {
  const nav = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      nav("/admin");
    } else if (!user) {
      nav("/login");
    }
  }, [nav]);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <p className="text-lg">Manage users here.</p>
      {/* Add user list and functionality here */}
    </div>
  );
};

export default UsersPage;
