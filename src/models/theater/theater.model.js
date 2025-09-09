const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
TheaterSchema.index({ name: 1, city: 1 });

module.exports = mongoose.model("Theater", TheaterSchema);
