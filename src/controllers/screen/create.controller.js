const Screen = require("../../models/screen/screen.model");
const Theater = require("../../models/theater/theater.model");
const generateSeats = require("../../utils/generateSeats");

const createScreen = async (req, res) => {
  try {
    const { theaterId, name, rows, cols } = req.body;

    // validate request body
    if (!theaterId || !name || !rows || !cols) {
      return res.status(400).json({
        message: "( theaterId, name, rows and cols ) All fields are required!",
      });
    }

    if (rows <= 0 || cols <= 0) {
      return res.status(400).json({
        message: "Rows and columns must be positive numbers",
      });
    }

    // check if theater exists
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({
        message: "Theater not found",
      });
    }

    // check if screen is already present
    const existingScreen = await Screen.findOne({
      theaterId,
      name: name.trim(),
    });

    if (existingScreen) {
      return res.status(409).json({
        message: "Screen with this name already exists in the theater",
      });
    }

    // generate seats according to the seat rows and cols
    const seats = generateSeats(rows, cols);
    const totalSeats = rows * cols;

    const screen = await Screen.create({
      theaterId,
      theaterName: theater.name,
      name: name.trim(),
      seats,
      totalSeats,
    });

    // Populate theater details for response
    const populatedScreen = await Screen.findById(screen._id)
      .populate("theaterId", "name city address")
      .lean();

    res.status(201).json({
      message: "Screen created successfully.",
      screen: populatedScreen,
    });
  } catch (err) {
    console.error("Create screen error:", err);
    res.status(500).json({
      message: "Failed to create screen.",
      error: err.message,
    });
  }
};

module.exports = createScreen;
