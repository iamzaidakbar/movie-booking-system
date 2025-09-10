const mongoose = require("mongoose");

const ScreenSchema = new mongoose.Schema(
  {
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
      index: true,
    },
    theaterName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    seats: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    slots: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Screen", ScreenSchema);
