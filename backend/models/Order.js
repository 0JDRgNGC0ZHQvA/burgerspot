const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: { type: Array, required: true },
  totalPrice: { type: Number, required: true },
  customerInfo: { type: Object, required: true },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
