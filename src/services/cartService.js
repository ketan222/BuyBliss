import axios from "axios";
import { API_URL } from "../config/constants";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Import product mock data for cart items
import { productService } from "./productService";

// Mock cart data for development
let mockCartItems = [];

const mockCartService = {
  getCart: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockCartItems;
  },

  addToCart: async (productId, quantity) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Get the product
    const product = await productService.getProductById(productId);

    // Check if product already in cart
    const existingItemIndex = mockCartItems.findIndex(
      (item) => item.product._id === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity if product exists
      mockCartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if not in cart
      mockCartItems.push({ product, quantity });
    }

    return mockCartItems;
  },

  updateCartItem: async (productId, quantity) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const existingItemIndex = mockCartItems.findIndex(
      (item) => item.product._id === productId
    );

    if (existingItemIndex === -1) {
      throw new Error("Product not found in cart");
    }

    mockCartItems[existingItemIndex].quantity = quantity;

    return mockCartItems;
  },

  removeFromCart: async (productId) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    mockCartItems = mockCartItems.filter(
      (item) => item.product._id !== productId
    );

    return mockCartItems;
  },

  clearCart: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));

    mockCartItems = [];

    return mockCartItems;
  },
};

// Export service functions
export const cartService = {
  getCart: async () => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockCartService.getCart();
      }

      // In production, use real API
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get cart");
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockCartService.addToCart(productId, quantity);
      }

      // In production, use real API
      const response = await api.post("/cart", { productId, quantity });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockCartService.updateCartItem(productId, quantity);
      }

      // In production, use real API
      const response = await api.put(`/cart/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  },

  removeFromCart: async (productId) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockCartService.removeFromCart(productId);
      }

      // In production, use real API
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  },

  clearCart: async () => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockCartService.clearCart();
      }

      // In production, use real API
      const response = await api.delete("/cart");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to clear cart");
    }
  },
};
