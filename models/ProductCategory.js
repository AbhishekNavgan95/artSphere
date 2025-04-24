const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },
  
});

module.exports = mongoose.model('ProductCategory', categorySchema);
