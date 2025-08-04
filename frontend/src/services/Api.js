import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: { Accept: "application/json" },
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  const expiry = localStorage.getItem("token_expiry");
  if (token && expiry && new Date() < new Date(expiry)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && new Date() > new Date(expiry)) {
    localStorage.clear();
    router.push({ path: "/login", query: { expired: true } });
    return Promise.reject(new Error("Token expired"));
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      router.push({ path: "/login", query: { expired: true } });
    }
    return Promise.reject(err);
  }
);

export default api;
