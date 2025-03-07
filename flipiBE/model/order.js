const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, ref: 'UserCredentials', required: true },
  items: [{
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  }],
  customization:{type:String},
});

module.exports = mongoose.model('Order', cartSchema);
