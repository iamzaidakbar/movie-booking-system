const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },
    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    row: {
      type: String,
      required: true,
      trim: true,
    },
    col: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["regular", "royal", "royalClub", "basic"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "held", "booked"],
      default: "available",
    },
    heldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seat", SeatSchema);
