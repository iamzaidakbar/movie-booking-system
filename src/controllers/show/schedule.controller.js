const Show = require("../../models/show/show.model");
const Movie = require("../../models/movie/movie.models");
const Screen = require("../../models/screen/screen.model");
const { addMinutes, isAfter, format } = require("date-fns");
const { getNextSlotAndDate, hasConflict } = require("../../helpers/helpers");

// Main controller
const scheduleShow = async (req, res) => {
  try {
    const { movieId, theaterId, screenId, date, slot, price } = req.body;

    // check if show already exists in the database
    const existingShow = await Show.findOne({
      movieId,
      theaterId,
      screenId,
    });
    if (existingShow) {
      return res.status(400).json({ message: "Show already exists." });
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

    // Loop to find available slot
    let found = false;
    let startTime, endTime;
    while (!found) {
      // Parse slot time (e.g., '08:00 AM')
      const timeStr = slots[slotIdx].time; // e.g., '08:00 AM'
      const [time, period] = timeStr.split(" ");
      let [hour, minute] = time.split(":").map(Number);
      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      startTime = new Date(currentDate);
      startTime.setHours(hour, minute, 0, 0);
      endTime = addMinutes(
        startTime,
        parseInt(movie.duration) +
          parseInt(process.env.CLEANUP_BUFFER_MINUTES || "15")
      );

      // Check for conflict
      const conflict = await hasConflict(screenId, startTime, endTime);
      if (!conflict) {
        found = true;
        break;
      }
      // Get next slot/date
      const next = getNextSlotAndDate(slots, slotIdx, currentDate);
      slotIdx = next.slotIdx;
      currentDate = format(new Date(next.date), "yyyy-MM-dd");
    }

    console.log(movie.duration);

    // Create show
    const show = await Show.create({
      screenId,
      screenName: screen.name,
      theaterId,
      theaterName: screen.theaterName,
      movieId,
      movieTitle: movie.title,
      movieDuration: movie.duration,
      startTime,
      endTime,
      status: "SCHEDULED",
      seats: screen.totalSeats,
      availableSeats: screen.totalSeats,
      price,
      timeSlot: slots[slotIdx], // will be an object {label, time}
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
