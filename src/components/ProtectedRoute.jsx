import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, role } = useAuth();

  console.log("ProtectedRoute Debugging:");
  console.log("isLoggedIn:", isLoggedIn); 
  console.log("role:", role); 
  console.log("requiredRole:", requiredRole); 

  if (!isLoggedIn || role !== requiredRole.toLowerCase()) {
    console.log("Unauthorized: Redirecting to /admin/login");
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
