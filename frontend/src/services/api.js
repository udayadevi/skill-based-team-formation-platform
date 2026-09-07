import axios from "axios";

let rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
rawUrl = String(rawUrl).trim().replace(/\/+$/, "");

// Gracefully handle base domain without /api suffix
if (!rawUrl.endsWith("/api")) {
  rawUrl = `${rawUrl}/api`;
}

const api = axios.create({
  baseURL: rawUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;