import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Optional spinner

  // Not logged in
  if (!user) return <Navigate to="/login" />;

  // Logged in but role not allowed
  if (!allowedRoles.includes(user.role)) {
    // Redirect to the corresponding dashboard
    if (user.role === "admin") return <Navigate to="/admin-dashboard" />;
    if (user.role === "kitchen") return <Navigate to="/kitchen-dashboard" />;
    if (user.role === "waiter") return <Navigate to="/waiter-dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
