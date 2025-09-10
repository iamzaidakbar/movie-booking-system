const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema(
  {
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
      index: true,
    },
    screenName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
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
      maxlength: 50,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },
    movieTitle: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    // Added duration to calculate end time
    movieDuration: {
      type: String,
      required: true,
    },
    // Changed from showTime to startTime for clarity
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    // Added endTime for conflict checking and cron jobs
    endTime: {
      type: Date,
      required: true,
    },
    // Added status field to track show lifecycle
    status: {
      type: String,
      enum: ["SCHEDULED", "ACTIVE", "ENDED", "CANCELLED"],
      default: "SCHEDULED",
      index: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Added timeSlot reference for predefined slots
    timeSlot: {
      type: mongoose.Schema.Types.Mixed, // Accepts object {label, time}
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for conflict checking
ShowSchema.index({ theaterId: 1, screenId: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Show", ShowSchema);
