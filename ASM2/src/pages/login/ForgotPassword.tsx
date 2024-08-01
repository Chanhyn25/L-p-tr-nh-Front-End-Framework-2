import React, { useState } from "react";
import emailjs from "emailjs-com";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const nav = useNavigate()
  const handleBackLogin = () => {
    nav('/login');
  }
  const handleBackRegister = () => {
    nav('/register');
  }

  const handleForgotPassword = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users?email=${email}`
      );
      if (response.data.length > 0) {
        const templateParams = {
          email_to: email,
          message: response.data[0].password,
        };
        await emailjs.send(
          "service_19jna74",
          "template_6wiy7qg",
          templateParams,
          "m7G4lnXjNVoBSbqHu"
        );
        setMessage("Password reset email sent!");
      } else {
        setMessage("Your email not found!");
      }
    } catch (error) {
      setMessage("Error sending password reset email");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-900 rounded">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Forgot Password</h1>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 border-gray-300"
          />
        </div>
        <button
          onClick={handleForgotPassword}
          className="w-full py-2 px-4 bg-black text-white font-bold rounded-md  hover:bg-gray-600"
        >
          Submit
        </button>
        <div className="flex justify-center space-x-4 mt-5">
          <button
            onClick={handleBackLogin}
            className="w-full max-w-xs py-2 px-4 bg-black text-white font-bold rounded-md hover:bg-gray-600"
          >
            Login
          </button>
          <button
            onClick={handleBackRegister}
            className="w-full max-w-xs py-2 px-4 bg-black text-white font-bold rounded-md hover:bg-gray-600"
          >
            Register
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-center ${message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
