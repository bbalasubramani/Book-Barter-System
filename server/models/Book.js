const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  condition: String,
  description: String,
  pageCount: Number,
  imageUrl: String,
  email: String, // Added email field
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  available: { type: Boolean, default: true }
});
module.exports = mongoose.model('Book', bookSchema);