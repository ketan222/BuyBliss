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

// Mock data for development
const mockProducts = [
  {
    _id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling headphones with 30-hour battery life.",
    price: 129.99,
    discountPrice: 99.99,
    stock: 25,
    category: "Electronics",
    images: [
      "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg",
      "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg",
    ],
    sellerId: "2",
    rating: 4.5,
    numReviews: 127,
    featured: true,
  },
  {
    _id: "2",
    name: "Smart Fitness Watch",
    description:
      "Track your fitness goals with heart rate monitoring, sleep tracking, and more.",
    price: 199.99,
    discountPrice: 149.99,
    stock: 18,
    category: "Electronics",
    images: [
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
      "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg",
    ],
    sellerId: "2",
    rating: 4.3,
    numReviews: 89,
    featured: true,
  },
  {
    _id: "3",
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable, eco-friendly cotton t-shirt available in various colors.",
    price: 29.99,
    discountPrice: null,
    stock: 50,
    category: "Clothing",
    images: [
      "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg",
      "https://images.pexels.com/photos/6347546/pexels-photo-6347546.jpeg",
    ],
    sellerId: "2",
    rating: 4.8,
    numReviews: 42,
    featured: false,
  },
  {
    _id: "4",
    name: "Professional Blender",
    description:
      "High-performance blender perfect for smoothies, soups, and more.",
    price: 89.99,
    discountPrice: 69.99,
    stock: 12,
    category: "Kitchen",
    images: [
      "https://images.pexels.com/photos/4439724/pexels-photo-4439724.jpeg",
      "https://images.pexels.com/photos/1310631/pexels-photo-1310631.jpeg",
    ],
    sellerId: "2",
    rating: 4.6,
    numReviews: 65,
    featured: true,
  },
  {
    _id: "5",
    name: "Leather Wallet",
    description:
      "Genuine leather wallet with RFID protection and multiple card slots.",
    price: 49.99,
    discountPrice: null,
    stock: 30,
    category: "Accessories",
    images: [
      "https://images.pexels.com/photos/2079172/pexels-photo-2079172.jpeg",
      "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg",
    ],
    sellerId: "2",
    rating: 4.4,
    numReviews: 37,
    featured: false,
  },
  {
    _id: "6",
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof, durable speaker with rich sound and 12-hour battery life.",
    price: 59.99,
    discountPrice: 49.99,
    stock: 20,
    category: "Electronics",
    images: [
      "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg",
      "https://images.pexels.com/photos/5966503/pexels-photo-5966503.jpeg",
    ],
    sellerId: "2",
    rating: 4.7,
    numReviews: 53,
    featured: true,
  },
];

const mockProductService = {
  getProducts: async (params = {}) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredProducts = [...mockProducts];

    // Filter by category if provided
    if (params.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Filter by search term if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by seller if provided
    if (params.sellerId) {
      filteredProducts = filteredProducts.filter(
        (p) => p.sellerId === params.sellerId
      );
    }

    // Sort products if sort param is provided
    if (params.sort) {
      switch (params.sort) {
        case "price-asc":
          filteredProducts.sort(
            (a, b) =>
              (a.discountPrice || a.price) - (b.discountPrice || b.price)
          );
          break;
        case "price-desc":
          filteredProducts.sort(
            (a, b) =>
              (b.discountPrice || b.price) - (a.discountPrice || a.price)
          );
          break;
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          // In a real app, we would sort by date created
          // Here we just reverse the order as a mock
          filteredProducts.reverse();
          break;
        default:
          break;
      }
    }

    // Get featured products if featured flag is provided
    if (params.featured) {
      filteredProducts = filteredProducts.filter((p) => p.featured);
    }

    return filteredProducts;
  },

  getProductById: async (id) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const product = mockProducts.find((p) => p._id === id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  createProduct: async (productData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newProduct = {
      _id: Date.now().toString(),
      ...productData,
      rating: 0,
      numReviews: 0,
    };

    mockProducts.push(newProduct);

    return newProduct;
  },

  updateProduct: async (id, productData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const productIndex = mockProducts.findIndex((p) => p._id === id);

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const updatedProduct = {
      ...mockProducts[productIndex],
      ...productData,
    };

    mockProducts[productIndex] = updatedProduct;

    return updatedProduct;
  },

  deleteProduct: async (id) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 700));

    const productIndex = mockProducts.findIndex((p) => p._id === id);

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const deletedProduct = mockProducts.splice(productIndex, 1)[0];

    return deletedProduct;
  },
};

// Export service functions
export const productService = {
  getProducts: async (params = {}) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockProductService.getProducts(params);
      }

      // In production, use real API
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get products"
      );
    }
  },

  getProductById: async (id) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockProductService.getProductById(id);
      }

      // In production, use real API
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get product");
    }
  },

  createProduct: async (productData) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockProductService.createProduct(productData);
      }

      // In production, use real API
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create product"
      );
    }
  },

  updateProduct: async (id, productData) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockProductService.updateProduct(id, productData);
      }

      // In production, use real API
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  },

  deleteProduct: async (id) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockProductService.deleteProduct(id);
      }

      // In production, use real API
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  },
};
