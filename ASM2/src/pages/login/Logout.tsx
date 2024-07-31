// Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    navigate("/");
  }, [navigate]);

  return null;
};

export default LogoutPage;
