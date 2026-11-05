import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ✅ Axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
});

export const registerStaff = (data) => api.post(`/auth/staff/register/`, data);

export const verifyEmail = (token) => api.get(`/auth/staff/verify-email/${token}/`);

export const loginStaff = (data) => api.post(`/auth/staff/login/`, data);

api.interceptors.request.use(async (config) => {
  let access = sessionStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!access && refresh) {
    try {
      const res = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
      access = res.data.access;
      sessionStorage.setItem("access", access);
    } catch (err) {
      console.error("Token refresh failed", err);
      localStorage.removeItem("refresh");
      sessionStorage.removeItem("access");
    }
  }

  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

export default api;
