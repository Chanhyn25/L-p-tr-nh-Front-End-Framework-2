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
    }
  }, [nav]);

  const onSubmit = async (data: User) => {
    console.log(data);
    try {
      if (isLogin) {
        const res = await instance.post(`/login`, data);
        if (res) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("accessToken", res.data.accessToken);
          if (res.data.user.role == "1") {
            nav("/admin");
          } else {
            nav("/");
          }
        }
      } else {
        console.log(data);
        await instance.post(`/register`, {
          email: data.email,
          password: data.password,
        });
        nav("/login");
      }
    } catch (error) {
      console.error("An error occurred:", error);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 rounded">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "LOGIN" : "REGISTER"}
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
              className={`mt-1 block w-full px-3 py-2 border rounded-md 
                }`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
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
              className={`mt-1 block w-full px-3 py-2 border rounded-md 
                 
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md 
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
            className="w-full py-2 px-4 bg-black-600 text-white font-bold rounded-md  hover:bg-gray-600"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <a
            href={isLogin ? "/register" : "/login"}
            className="ml-1 text-gray-900 hover:text-gray-500 font-bold"
          >
            {isLogin ? "Register" : "Login"}
          </a>
          {isLogin && (
            <div className="mt-2">
              <a
                href="/forgot-password"
                className=" text-gray-900 hover:text-gray-500 font-bold"
              >
                Forgot Password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
