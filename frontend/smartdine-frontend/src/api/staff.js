import axios from "axios";

const API_URL = "http://localhost:8000";

export const registerStaff = (data) =>
  axios.post(`${API_URL}/auth/staff/register/`, data);

export const verifyEmail = (token) =>
  axios.get(`${API_URL}/auth/staff/verify-email/${token}/`);

export const loginStaff = (data) =>
  axios.post(`${API_URL}/auth/staff/login/`, data);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  let access = sessionStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!access && refresh) {
    try {
      const res = await axios.post(`${API_URL}/auth/token/refresh/`, {
        refresh,
      });
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
