const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: "items.product",
      model: "Product",
    });

    if (!cart) {
      // If no cart exists, create an empty one
      cart = new Cart({
        userId: req.user.id,
        items: [],
      });
      await cart.save();
    }

    // Format response to match client expectations
    const formattedItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [],
      });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if product exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item if product not in cart
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    // Populate product data before sending response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "Product",
    });

    // Format response to match client expectations
    const formattedItems = populatedCart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    // Populate product data before sending response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "Product",
    });

    // Format response to match client expectations
    const formattedItems = populatedCart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's cart
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Populate product data before sending response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "Product",
    });

    // Format response to match client expectations
    const formattedItems = populatedCart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete("/", async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear cart items
    cart.items = [];

    await cart.save();

    res.json([]);
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
