import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User } from "../../interfaces/user";
import { loginSchema, registerSchema } from "../../utils/valtidation";
import { instance } from "../../services/api/config";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Props = {
  isLogin?: boolean;
};

const LoginPage = ({ isLogin }: Props) => {
  const nav = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<User>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      nav("/admin");
    } else if (user) {
      nav("/");
    } else {
      nav("/login");
    }
  }, [nav]);

  const onSubmit = async (data: User) => {
    console.log(data);
    try {
      if (isLogin) {
        // Logic login
        const res = await instance.post(`/login`, data);
        if (res) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("accessToken", res.data.accessToken);
          if (res.data.role) {
            nav("/admin");
          } else {
            nav("/");
          }
        }
      } else {
        // Logic register
        console.log(data);
        await instance.post(`/register`, {
          email: data.email,
          password: data.password,
        });
        nav("/login");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Optional: Handle errors (e.g., show a notification)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {!isLogin && (
          <div className="mb-4">
            <label
              htmlFor="confirmPass"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPass"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                errors.confirmPass
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              {...register("confirmPass", {
                required: "Confirm Password is required",
              })}
            />
            {errors.confirmPass && (
              <span className="text-red-500 text-sm">
                {errors.confirmPass.message}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
