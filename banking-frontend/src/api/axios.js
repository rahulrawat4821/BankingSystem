import axios from "axios";

const API = axios.create({
  baseURL: "https://banking-system-production-9286.up.railway.app",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.includes("/api/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;