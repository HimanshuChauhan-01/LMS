import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until AuthContext finishes checking token
  if (loading) return null;

  // If not logged in → go to Home
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
