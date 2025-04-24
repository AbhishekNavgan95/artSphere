const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: "artist",
  },
  bio: String,
  socialLinks: [String],
});

module.exports = mongoose.model("Artist", artistSchema);
