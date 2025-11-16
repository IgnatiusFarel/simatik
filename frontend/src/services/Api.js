import axios from "axios";
import router from "@/router";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://simatik-production.up.railway.app/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",       
  },
  timeout: 60000,
});
console.log("API Base URL yang digunakan:", baseURL);

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
    
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
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
