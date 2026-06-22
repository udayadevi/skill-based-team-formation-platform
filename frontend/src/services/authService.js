import api from "./api";

// REGISTER USER
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// LOGIN USER
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};