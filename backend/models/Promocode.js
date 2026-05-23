const mongoose = require('mongoose');

const PromocodeSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true, unique: true },
  type: { type: String, required: true }, // 'percent' или 'fixed'
  value: { type: Number, required: true },
  minOrderSum: { type: Number, default: 0 },
  expiresAt: { type: String },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Promocode', PromocodeSchema);
