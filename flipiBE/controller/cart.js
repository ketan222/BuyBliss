const Cart = require('../model/cart');
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.addToCart = async (req, res) => {
  let { productId, quantity,price ,image} = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.email;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }
    console.log(userId);
    
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId === productId);
    price = parseFloat(price.replace("₹", "").replace(",", ""));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price,});
    }

    await cart.save();

    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCart = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.email;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;

  // Ensure quantity is a valid positive number
  if (quantity <= 0 || isNaN(quantity)) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  // Extract token from authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.email; // Assuming email is used as userId

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const item = cart.items.find(item => item.productId === productId);
    if (item) {
      // Update item quantity
      item.quantity = quantity;
      await cart.save(); // Save the updated cart

      // Return the updated cart items
      return res.status(200).json({ message: 'Cart updated successfully', items: cart.items });
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (err) {
    console.error(err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;

  // Extract token from authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.email; // Assuming email is used as userId

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();

    // Return the updated cart items
    res.status(200).json({ message: 'Item removed from cart', items: cart.items });

  } catch (err) {
    console.error(err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.removeAllItems = async (req, res) => {
  // Extract token from authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.email; // Assuming email is used as userId

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear all items from the cart
    cart.items = [];
    await cart.save();

    // Return a response indicating the cart has been cleared
    res.status(200).json({ message: 'All items removed from cart', items: cart.items });

  } catch (err) {
    console.error(err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
    
  }
};
// Clear cart for a specific user
exports.clearCart = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.email; // Assuming email is stored in the token

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }

    // Find and clear the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = []; // Clear the items array
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};
