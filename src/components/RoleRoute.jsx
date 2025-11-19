import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ children, allowed }) => {
  const { user, loading } = useAuth();

  // Waiting while checking authentication
  if (loading) return null;

  // Not logged in at all → block
  if (!user) return <Navigate to="/" />;

  // Check role permission
  if (allowed.includes(user.role)) {
    return children;
  }

  // Logged in but wrong role → redirect to dashboard
  return <Navigate to="/dashboard" />;
};

export default RoleRoute;
