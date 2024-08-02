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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        WELCOME TO ROYAL SOFAS ADMIN
      </h1>
      <p>Let's manage the Royal Sofas website now.</p>
      
    </div>
  );
};

export default Dashboard;
