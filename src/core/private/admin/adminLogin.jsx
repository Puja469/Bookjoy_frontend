import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Admin Login Response:", data);

        // Validate presence of required fields
        if (!data.role || !data.adminId || !data.token || !data.fname) {
          toast.error("Login failed: Missing required data from server.");
          return;
        }

        // Store admin-specific details
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("adminId", data.adminId);
        localStorage.setItem("role", data.role.toLowerCase());
        localStorage.setItem("token", data.token);
        localStorage.setItem("fname", data.fname);

        // Use context login function
        login({
          id: data.adminId,
          userRole: data.role,
          authToken: data.token,
          userFname: data.fname,
        });

        toast.success("Admin logged in successfully!");
        navigate("/admin/dashboard");
      } else {
        const data = await response.json();
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center text-purple-600 mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
