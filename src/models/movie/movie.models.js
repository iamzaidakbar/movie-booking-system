const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
      required: true,
    },
    trailerUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    format: {
      type: [String],
      required: true,
    },
    certification: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    rating: {
      score: { type: Number, required: true },
      votes: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
