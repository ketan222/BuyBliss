const Order = require('../model/order'); // Adjust the path based on your file structure

// Function to create and save an order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items ,customization} = req.body;

    // Validate required fields
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'User ID and items are required' });
    }

    // Calculate the total price for the order
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      customization,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
