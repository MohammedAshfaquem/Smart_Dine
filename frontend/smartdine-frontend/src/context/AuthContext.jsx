import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // e.g., { role: "admin" }
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user info from storage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedRefresh = localStorage.getItem("refresh");
    const storedAccess = sessionStorage.getItem("access");

    if (storedRole && storedRefresh) {
      setUser({ role: storedRole });
      setRefreshToken(storedRefresh);
      setAccessToken(storedAccess);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = ({ role, access, refresh }) => {
    localStorage.setItem("role", role);
    localStorage.setItem("refresh", refresh);
    sessionStorage.setItem("access", access);

    setUser({ role });
    setAccessToken(access);
    setRefreshToken(refresh);

    // Navigate to the corresponding dashboard immediately after login
    if (role === "admin") navigate("/admin-dashboard");
    else if (role === "kitchen") navigate("/kitchen-dashboard");
    else if (role === "waiter") navigate("/waiter-dashboard");
    else navigate("/");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
