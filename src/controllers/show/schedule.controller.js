const Show = require("../../models/show/show.model");
const Movie = require("../../models/movie/movie.models");
const Screen = require("../../models/screen/screen.model");
const { addMinutes, format } = require("date-fns");
const { slotConflict, findAvailableSlot } = require("../../helpers/helpers");

// Main controller
const scheduleShow = async (req, res) => {
  try {
    const { movieId, theaterId, screenId, date, slot, price } = req.body;

    // Check for slot conflict using helper (returns boolean)
    const isSlotConflict = await slotConflict(screenId, slot, date);
    if (isSlotConflict) {
      return res.status(400).json({
        message:
          "A show is already scheduled for this slot on this date and screen.",
      });
    }

    if (!movieId || !theaterId || !screenId || !date || !slot || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found." });

    const screen = await Screen.findById(screenId);
    if (!screen || String(screen.theaterId) !== String(theaterId)) {
      return res.status(404).json({ message: "Screen not found in theater." });
    }

    // Validate slot (slot should be an object with label and time)
    const slots = screen.slots;
    let slotIdx = slots.findIndex(
      (s) => s.label === slot.label && s.time === slot.time
    );
    let currentDate = date;
    if (slotIdx === -1) {
      return res.status(400).json({ message: "Invalid slot for this screen." });
    }

    // Find next available slot and times using helper
    const {
      startTime,
      endTime,
      slotIdx: availableSlotIdx,
      currentDate: availableDate,
    } = await findAvailableSlot(
      screenId,
      slots,
      slotIdx,
      currentDate,
      movie.duration
    );
    slotIdx = availableSlotIdx;
    currentDate = availableDate;

    // Create show
    const show = await Show.create({
      screenId,
      screenName: screen.name,
      theaterId,
      theaterName: screen.theaterName,
      movieId,
      movieTitle: movie.title,
      movieDuration: parseInt(movie.duration),
      startTime,
      endTime,
      status: "SCHEDULED",
      seats: screen.totalSeats,
      availableSeats: screen.totalSeats,
      price,
      timeSlot: slots[slotIdx],
    });

    res.status(201).json({ message: "Show scheduled.", show });
  } catch (err) {
    console.error("Schedule show error:", err);
    res
      .status(500)
      .json({ message: "Failed to schedule show.", error: err.message });
  }
};

module.exports = scheduleShow;
