import axios from "axios";
import { API_URL } from "../config/constants";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Attach token if available
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  // LOGIN
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data; // { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // REGISTER
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data; // { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // GET LOGGED IN USER DATA
  getUserData: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data; // { _id, name, email, ... }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get user data"
      );
    }
  },

  // UPDATE PROFILE
  updateProfile: async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);
      return response.data; // updated user object
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },
};
