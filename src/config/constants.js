// API URL for production
export const API_URL = "https://buybliss-production.up.railway.app/api/";

// MongoDB Connection
export const MONGODB_URI =
  "mongodb+srv://kashish271204:o4tahgKuW8a3224W@cluster0.zgr1v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  key_id: "rzp_test_zbeQS0DKCjr4Vm",
  currency: "USD",
  name: "BuyBliss",
  description: "Purchase from BuyBliss",
};

// Categories
export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Kitchen",
  "Home & Garden",
  "Beauty & Health",
  "Sports & Outdoors",
  "Toys & Games",
  "Books",
  "Accessories",
  "Other",
];

// Roles
export const USER_ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Methods
export const PAYMENT_METHODS = {
  RAZORPAY: "razorpay",
  CASH_ON_DELIVERY: "cod",
};
