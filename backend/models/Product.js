const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // если есть картинки
  category: { type: String } // например: 'burgers', 'sauces'
});

module.exports = mongoose.model('Product', ProductSchema);
