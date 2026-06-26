import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  console.log("TOKEN FOUND:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("HEADERS:", config.headers);

  return config;
});

export default api;