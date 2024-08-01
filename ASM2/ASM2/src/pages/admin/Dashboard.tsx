import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../interfaces/user";

<link
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  rel="stylesheet"
/>;
const Dashboard = () => {
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
    <div className="d-flex flex-column pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">Dashboard</h1>
      <div className="d-flex justify-content-between">
        <a href="/" className="link-black">
          admin
        </a>
        <a href="/admin/products/add" className="link-black">
          Add
        </a>
        <a href="/login" className="link-black">
          Login
        </a>
        <a href="/register" className="link-black">
          Register
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
