import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  verifyOtp,
  sendPasswordResetOtp,
  resetPassword,
  sendVerificationOtp,
} from "../../../services/apiServices";
import "react-toastify/dist/ReactToastify.css";
import AuthImage from "../../../../src/assets/wedding.jpg";

function Register() {
  const [activeTab, setActiveTab] = useState("signup");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetData, setResetData] = useState({ email: "", otp: "", newPassword: "" });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      return loginUser(loginData);
    },
    onSuccess: (data) => {
      console.log(" Login response data:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("fname", data.fname);
  //     localStorage.setItem("email", data.email || "");   
  // localStorage.setItem("phone", data.phone || "");

      login({
        id: data.userId || data.adminId,
        userRole: data.role,
        authToken: data.token,
        // userFname: data.fname,
        // userEmail: data.email,     
    userPhone: data.phone, 
      });
      toast.success("Login successful!");
      setLoginData({
        email: "",
        password: "",
      });
      
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const signUpMutation = useMutation({
    mutationFn: async (registrationData) => {
      return registerUser(registrationData);
    },
    onSuccess: () => {
      toast.success("Registration successful! Check your email for OTP.");
      setShowOtpField(true); 
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const registrationData = {
      fname: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
      city: formData.city,
      password: formData.password,
    };

    signUpMutation.mutate(registrationData);
  };

  const verifyOtpMutation = useMutation({
    mutationFn: async (otpData) => {
      return verifyOtp(otpData);
    },
    onSuccess: () => {
      toast.success("Email verified successfully! Please log in.");
      setShowOtpField(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid OTP");
    },
  });

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpData = { email: formData.email, otp };
    verifyOtpMutation.mutate(otpData);
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      return sendPasswordResetOtp(email);
    },
    onSuccess: () => {
      toast.success("OTP sent to your email!");
      setShowResetPassword(true);
      setShowForgotPasswordForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error sending OTP");
    },
  });

  const handleForgotPassword = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(forgotPasswordEmail);
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async (resetData) => {
      return resetPassword(resetData);
    },
    onSuccess: () => {
      toast.success("Password reset successful! Please log in.");
      setShowResetPassword(false);
      setShowForgotPasswordForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Reset password failed");
    },
  });

  const handleResetPassword = (e) => {
    e.preventDefault();
    resetPasswordMutation.mutate(resetData);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col md:flex-row w-11/12 md:w-4/5 max-w-4xl shadow-lg rounded-lg overflow-hidden bg-gray-100">
        <div className="w-full md:w-1/2">
          <img src={AuthImage} alt="Decorative" className="h-48 md:h-full w-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 md:px-8 md:py-12">
          <div className="max-w-md w-full">
            <div className="flex justify-center border-b border-gray-200">
              <button className={`flex-1 py-2 text-center text-lg font-semibold ${activeTab === "login" ? "text-[#F87171] border-b-2 border-[#F87171]" : "text-gray-500"}`} onClick={() => setActiveTab("login")}>
                Login
              </button>
              <button className={`flex-1 py-2 text-center text-lg font-semibold ${activeTab === "signup" ? "text-[#F87171] border-b-2 border-[#F87171]" : "text-gray-500"}`} onClick={() => setActiveTab("signup")}>
                Sign Up
              </button>
            </div>

            <div className="mt-6 min-h-[520px] flex flex-col justify-between">
            {showOtpField ? (
  <form className="space-y-4" onSubmit={handleVerifyOtp}>
    <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
    <input 
      type="text" 
      value={otp} 
      onChange={(e) => setOtp(e.target.value)} 
      placeholder="Enter OTP" 
      className="w-full mt-1 p-2 border border-gray-300 rounded-md" 
      required 
    />
    <button type="submit" className="w-full py-2 bg-[#F87171] text-white rounded-md">
      Verify OTP
    </button>
  </form>
              ) : showResetPassword ? (
                <form className="space-y-4" onSubmit={handleResetPassword}>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" value={resetData.newPassword} onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })} placeholder="Enter New Password" className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <input type="text" value={resetData.otp} onChange={(e) => setResetData({ ...resetData, otp: e.target.value })} placeholder="Enter OTP" className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                  <button type="submit" className="w-full py-2 bg-[#F87171] text-white rounded-md">Reset Password</button>
                </form>
              ) : showForgotPasswordForm ? (
                <form className="space-y-4" onSubmit={handleForgotPassword}>
                  <label className="block text-sm font-medium text-gray-700">Enter your email to reset password</label>
                  <input type="email" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} placeholder="Enter your email" className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                  <button type="submit" className="w-full py-2 bg-[#F87171] text-white rounded-md">Send OTP</button>
                </form>
              ) : activeTab === "signup" ? (
                <form className="space-y-4" onSubmit={handleSignUp}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                    >
                      <option value="">Select City</option>
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Lalitpur">Bhaktapur</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      required
      className="accent-[#F87171] w-4 h-4"
    />
    <label className="text-sm text-gray-700">
      I agree to the <span className="text-[#F87171] underline cursor-pointer">terms</span> and <span className="text-[#F87171] underline cursor-pointer">privacy policy</span>
    </label>
  </div>

  <button
    type="submit"
    className="w-full py-3 rounded-full bg-[#F87171] hover:bg-[#f76565] text-white font-medium transition"
    disabled={signUpMutation.isLoading}
  >
    {signUpMutation.isLoading ? "Creating Account..." : "Create an account"}
  </button>
  <p className="text-center text-sm text-gray-500">
    Already a member?{" "}
    <span
      onClick={() => setActiveTab("login")}
      className="text-[#F87171] font-semibold cursor-pointer"
    >
      Login
    </span>
  </p>
                </form>
              ) : (
                <form className="flex flex-col justify-between h-full space-y-4" onSubmit={handleLogin}>
                 <h2 className="text-2xl font-bold text-gray-900">Login</h2>
<p className="text-sm text-gray-500 mb-4">Login your account in a seconds</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="Email"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Password"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#F87171] focus:border-[#F87171]"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center text-sm text-[#F87171]">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onChange={handleLoginChange}
                        className="mr-2 accent-[#F87171]"
                      />
                      Remember Me
                    </label>
                    <button
                      type="button"
                      className="text-sm text-[#F87171] hover:underline"
                      onClick={() => setShowForgotPasswordForm(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
  type="submit"
  className="w-full py-3 rounded-full bg-[#F87171] text-white font-semibold hover:bg-[#f76565] transition"
  disabled={loginMutation.isLoading}
>
  {loginMutation.isLoading ? "Logging In..." : "Login"}
</button>

<p className="text-center text-sm text-gray-500">
  Don’t have an account?{" "}
  <span
    onClick={() => setActiveTab("signup")}
    className="text-[#F87171] font-semibold cursor-pointer underline"
  >
    Sign Up
  </span>
</p>

                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;