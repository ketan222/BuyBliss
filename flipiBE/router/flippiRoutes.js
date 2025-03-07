const express = require('express');
const router = express.Router();

const { signup, login, sendOtp, verifyOtp } = require('../controller/auth');
const { newsletterSubmit } = require('../controller/newsletter');
const { contactus } = require('../controller/contact');
const { authenticateToken } = require('../middleware/auth');
const { getCart, addToCart, updateCart, removeFromCart, removeAllItems } = require('../controller/cart');
const { createOrder } = require('../controller/order');
const {userCount,ordersCount,newsletterCount,totalItemsSold} = require('../controller/analysis');
// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/newsletter", newsletterSubmit);
router.post("/contact", contactus);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
       
// Routes for Cart operations
router.post('/add-to-cart', authenticateToken, addToCart);
router.get('/get-cart', authenticateToken, getCart);
router.post('/update-cart', authenticateToken, updateCart);
router.post('/remove-from-cart', authenticateToken, removeFromCart);
router.delete('/clear-cart', authenticateToken, removeAllItems);  

// Order route
router.post('/create-order', authenticateToken, createOrder);
router.get("/user-count",userCount);
router.get("/orders-count",ordersCount);
router.get("/newsletter-count",newsletterCount);
router.get('/total-items-sold', totalItemsSold);
// Token validation route
router.get('/validate-token', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.user });
});

module.exports = router;
