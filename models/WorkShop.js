const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    secure_url: String,
    public_id: String,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["online", "offline"],
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
  },
  participents: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      model: {
        type: String,
        required: true,
        enum: ["Artist", "Customer"],
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
});

module.exports = mongoose.model("Workshop", workshopSchema);
