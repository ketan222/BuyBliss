const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    // Allow public routes to proceed without authentication
    req.user = null;
    return next();
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'buybliss-secret-key', (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

// Check if user is a seller
const isSeller = (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied. Seller role required.' });
  }
  next();
};

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sort,
      featured,
      sellerId
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (sellerId) {
      filter.sellerId = sellerId;
    }
    
    // Build sort object
    let sortOption = {};
    
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }
    
    const products = await Product.find(filter).sort(sortOption);
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Sellers only)
router.post('/', authenticateToken, isSeller, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      images,
      featured
    } = req.body;
    
    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      images,
      sellerId: req.user.id,
      featured: featured || false,
      rating: 0,
      numReviews: 0
    });
    
    const savedProduct = await newProduct.save();
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Sellers only)
router.put('/:id', authenticateToken, isSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the logged-in seller owns this product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      images,
      featured
    } = req.body;
    
    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;
    if (images) product.images = images;
    if (featured !== undefined) product.featured = featured;
    
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Sellers only)
router.delete('/:id', authenticateToken, isSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the logged-in seller owns this product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await product.remove();
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;