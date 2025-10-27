import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Optional spinner

  // If logged in, redirect to dashboard
  if (user) {
    if (user.role === "admin") return <Navigate to="/admin-dashboard" />;
    if (user.role === "kitchen") return <Navigate to="/kitchen-dashboard" />;
    if (user.role === "waiter") return <Navigate to="/waiter-dashboard" />;
  }

  return children;
};

export default PublicRoute;
