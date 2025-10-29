import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const login = ({ role, access, refresh }) => {
    localStorage.setItem("role", role);
    localStorage.setItem("refresh", refresh);
    sessionStorage.setItem("access", access);

    setUser({ role });
    setAccessToken(access);
    setRefreshToken(refresh);

    if (role === "admin") navigate("/admin-dashboard");
    else if (role === "kitchen") navigate("/kitchen-dashboard");
    else if (role === "waiter") navigate("/waiter-dashboard");
    else navigate("/");
  };

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
