import axios from "axios";

const API = axios.create({
  baseURL: "https://bankingsystem-rfqy.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.includes("/api/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

setInterval(() => {
  fetch("https://bankingsystem-rfqy.onrender.com/api/auth/health").catch(() => {});
}, 600000);

export default API;