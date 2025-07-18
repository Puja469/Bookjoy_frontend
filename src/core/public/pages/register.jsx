import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthImage from "../../../../src/assets/wedding.jpg";
import { useAuth } from "../../../context/AuthContext";
import {
  loginUser,
  registerUser,
  resetPassword,
  sendPasswordResetOtp,
  verifyOtp
} from "../../../services/apiServices";

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#F87171]/20 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-300/30 to-transparent rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-[#F87171]/25 to-transparent rounded-full blur-lg animate-bounce" style={{ animationDelay: '0.5s' }}></div>

        {/* Geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-[#F87171]/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 border-2 border-pink-300/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[700px]">

              {/* Left side - Enhanced Image Section */}
              <div className="lg:w-1/2 relative overflow-hidden group">
                {/* Multiple gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F87171]/30 via-transparent to-pink-300/20 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20"></div>

                {/* Animated image */}
                <img
                  src={AuthImage}
                  alt="Wedding celebration"
                  className="h-full w-full object-cover transform scale-110 transition-all duration-1000 group-hover:scale-105"
                />

                {/* Floating content */}
                <div className="absolute inset-0 z-30 flex items-end p-8">
                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                        Welcome to <span className="text-yellow-200">BookJoy</span>
                      </h1>
                      <p className="text-white/95 text-lg leading-relaxed">
                        Discover and book the perfect venue for your special moments.
                        From intimate gatherings to grand celebrations.
                      </p>
                    </div>

                    {/* Feature highlights */}
                    <div className="flex space-x-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <svg className="w-6 h-6 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <svg className="w-6 h-6 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <svg className="w-6 h-6 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Enhanced Forms */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-white via-gray-50/50 to-white">
                <div className="w-full max-w-md">

                  {/* Enhanced Tab Navigation */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1.5 mb-8 shadow-inner">
                    <div className="flex relative">
                      <div
                        className={`absolute top-1.5 bottom-1.5 w-1/2 bg-white rounded-xl shadow-md transition-all duration-500 ease-out ${activeTab === "login" ? "left-1.5" : "left-[calc(50%+3px)]"
                          }`}
                      ></div>
                      <button
                        className={`flex-1 py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 relative z-10 ${activeTab === "login"
                            ? "text-[#F87171]"
                            : "text-gray-500 hover:text-gray-700"
                          }`}
                        onClick={() => setActiveTab("login")}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>Login</span>
                        </div>
                      </button>
                      <button
                        className={`flex-1 py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 relative z-10 ${activeTab === "signup"
                            ? "text-[#F87171]"
                            : "text-gray-500 hover:text-gray-700"
                          }`}
                        onClick={() => setActiveTab("signup")}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span>Sign Up</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Forms Container */}
                  <div className="min-h-[550px]">
                    {showOtpField ? (
                      <div className="space-y-8 animate-slideUp">
                        <div className="text-center">
                          <div className="relative w-20 h-20 bg-gradient-to-br from-[#F87171] to-[#F87171] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Email</h3>
                          <p className="text-gray-600 leading-relaxed">We've sent a 6-digit verification code to your email address</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                          <div className="relative">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="000000"
                              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 text-center text-2xl tracking-[0.5em] font-bold bg-white/80 backdrop-blur-sm"
                              maxLength={6}
                              required
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                          </div>
                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#F87171] via-[#F87171] to-[#F87171] text-white rounded-2xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                            disabled={verifyOtpMutation.isLoading}
                          >
                            <span className="relative z-10">
                              {verifyOtpMutation.isLoading ? "Verifying..." : "Verify OTP"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </button>
                        </form>
                      </div>
                    ) : showResetPassword ? (
                      <div className="space-y-8 animate-slideUp">
                        <div className="text-center">
                          <div className="relative w-20 h-20 bg-gradient-to-br from-[#F87171] to-[#F87171] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">Reset Password</h3>
                          <p className="text-gray-600">Enter your new password and the OTP sent to your email</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <input
                              type="password"
                              value={resetData.newPassword}
                              onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                              placeholder="New Password"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                              required
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              value={resetData.otp}
                              onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                              placeholder="Enter OTP"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#F87171] via-[#F87171] to-[#F87171] text-white rounded-2xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                            disabled={resetPasswordMutation.isLoading}
                          >
                            <span className="relative z-10">
                              {resetPasswordMutation.isLoading ? "Resetting..." : "Reset Password"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </button>
                        </form>
                      </div>
                    ) : showForgotPasswordForm ? (
                      <div className="space-y-8 animate-slideUp">
                        <div className="text-center">
                          <div className="relative w-20 h-20 bg-gradient-to-br from-[#F87171] to-[#F87171] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">Forgot Password?</h3>
                          <p className="text-gray-600">Enter your email to receive password reset instructions</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              value={forgotPasswordEmail}
                              onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              placeholder="Enter your email"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#F87171] via-[#F87171] to-[#F87171] text-white rounded-2xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                            disabled={forgotPasswordMutation.isLoading}
                          >
                            <span className="relative z-10">
                              {forgotPasswordMutation.isLoading ? "Sending..." : "Send Reset Link"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </button>
                        </form>
                      </div>
                    ) : activeTab === "signup" ? (
                      <div className="space-y-8 animate-slideUp">
                        <div className="text-center">
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-[#F87171] to-[#F87171] bg-clip-text text-transparent mb-3">
                            Create Account
                          </h3>
                          <p className="text-gray-600">Join thousands of happy customers worldwide</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSignUp}>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Full Name"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Email Address"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <select
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 appearance-none bg-white/80 backdrop-blur-sm"
                            >
                              <option value="">Select City</option>
                              <option value="Kathmandu">Kathmandu</option>
                              <option value="Lalitpur">Lalitpur</option>
                              <option value="Bhaktapur">Bhaktapur</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                              />
                            </div>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm Password"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                              />
                            </div>
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              placeholder="Phone Number"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <input
                              type="checkbox"
                              required
                              className="mt-1 accent-[#F87171] w-4 h-4 rounded"
                            />
                            <label className="text-sm text-gray-600 leading-relaxed">
                              I agree to the{" "}
                              <span className="text-[#F87171] font-semibold cursor-pointer hover:underline">Terms of Service</span>{" "}
                              and{" "}
                              <span className="text-[#F87171] font-semibold cursor-pointer hover:underline">Privacy Policy</span>
                            </label>
                          </div>
                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#F87171] via-[#F87171] to-[#F87171] text-white rounded-2xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                            disabled={signUpMutation.isLoading}
                          >
                            <span className="relative z-10">
                              {signUpMutation.isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  <span>Creating Account...</span>
                                </div>
                              ) : (
                                "Create Account"
                              )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </button>
                          <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <span
                              onClick={() => setActiveTab("login")}
                              className="text-[#F87171] font-semibold cursor-pointer hover:underline"
                            >
                              Sign In
                            </span>
                          </p>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-8 animate-slideUp">
                        <div className="text-center">
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-[#F87171] to-[#F87171] bg-clip-text text-transparent mb-3">
                            Welcome Back
                          </h3>
                          <p className="text-gray-600">Sign in to your account to continue</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleLogin}>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={loginData.email}
                              onChange={handleLoginChange}
                              placeholder="Email Address"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#F87171] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <input
                              type="password"
                              name="password"
                              value={loginData.password}
                              onChange={handleLoginChange}
                              placeholder="Password"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#F87171]/20 focus:border-[#F87171] transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <label className="flex items-center text-sm text-gray-600">
                              <input
                                type="checkbox"
                                name="rememberMe"
                                checked={loginData.rememberMe}
                                onChange={handleLoginChange}
                                className="mr-2 accent-[#F87171] rounded"
                              />
                              Remember me
                            </label>
                            <button
                              type="button"
                              className="text-sm text-[#F87171] font-semibold hover:underline"
                              onClick={() => setShowForgotPasswordForm(true)}
                            >
                              Forgot password?
                            </button>
                          </div>
                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#F87171] via-[#F87171] to-[#F87171] text-white rounded-2xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                            disabled={loginMutation.isLoading}
                          >
                            <span className="relative z-10">
                              {loginMutation.isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  <span>Signing In...</span>
                                </div>
                              ) : (
                                "Sign In"
                              )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </button>
                          <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <span
                              onClick={() => setActiveTab("signup")}
                              className="text-[#F87171] font-semibold cursor-pointer hover:underline"
                            >
                              Sign Up
                            </span>
                          </p>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Register;