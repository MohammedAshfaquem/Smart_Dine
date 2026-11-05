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
    const storedUser = localStorage.getItem("user");
    const storedRefresh = localStorage.getItem("refresh");
    const storedAccess = sessionStorage.getItem("access");

    if (storedUser && storedRefresh) {
      setUser(JSON.parse(storedUser)); // ✅ restore full user object
      setRefreshToken(storedRefresh);
      setAccessToken(storedAccess);
    }

    setLoading(false);
  }, []);

  const login = ({ user, access, refresh }) => {
    // ✅ store full user info
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("refresh", refresh);
    sessionStorage.setItem("access", access);

    setUser(user);
    setAccessToken(access);
    setRefreshToken(refresh);

    if (user.role === "admin") navigate("/admin-dashboard");
    else if (user.role === "kitchen") navigate("/kitchen-dashboard");
    else if (user.role === "waiter") navigate("/waiter-dashboard");
    else navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("user");
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
