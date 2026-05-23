const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  customer: { type: Object, required: true },
  promocode: { type: String, default: null },
  discount: { type: Number, default: 0 },
  finalTotal: { type: Number, required: true },
  deliveryMethod: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
