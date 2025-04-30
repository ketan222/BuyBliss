const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: 'items.product',
        model: 'Product'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: 'items.product',
      model: 'Product'
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    } = req.body;
    
    // Validate order items and check stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.product}` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}` 
        });
      }
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Create new order
    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });
    
    const savedOrder = await newOrder.save();
    
    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } }
    );
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;