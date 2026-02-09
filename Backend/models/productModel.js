const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  // Cloudinary public id for the uploaded image (used for deletion)
  image_public_id: {
    type: String
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: true
  },
  sizes: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    default: 0
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', productSchema);
