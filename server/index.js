const crypto = require("crypto");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Razorpay = require("razorpay");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

// Initialize Express app
const app = express();
app.use(
  cors({
    origin: "https://buy-bliss-three.vercel.app/", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies if needed
  })
);
const PORT = process.env.PORT || 5000;

// Middleware

const razorpay = new Razorpay({
  key_id: "rzp_test_zbeQS0DKCjr4Vm",
  key_secret: "UfCcwcZpd51BHKxYgmHtxuw0",
});

app.post("/api/v1/create-order-razorpay", async (req, res) => {
  console.log(req.body);
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/v1/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "UfCcwcZpd51BHKxYgmHtxuw0")
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "buybliss-secret-key",
    (err, user) => {
      if (err)
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      req.user = user;
      next();
    }
  );
};

// Check role middleware
const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res
      .status(403)
      .json({ message: `Access denied. ${role} role required.` });
  }
  next();
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", authenticateToken, cartRoutes);
app.use("/api/orders", authenticateToken, orderRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("BuyBliss API is running");
});

// Connect to MongoDB and start server
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://kashish271204:o4tahgKuW8a3224W@cluster0.zgr1v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
