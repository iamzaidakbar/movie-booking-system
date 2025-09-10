const Show = require("../models/show/show.model");
const { addMinutes } = require("date-fns");

// Helper: Find next available slot and times
async function findAvailableSlot(
  screenId,
  slots,
  slotIdx,
  currentDate,
  movieDuration
) {
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
      parseInt(movieDuration) +
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
  return { startTime, endTime, slotIdx, currentDate };
}

// Helper: Get next slot and date
function getNextSlotAndDate(slots, currentSlotIdx, currentDate) {
  if (currentSlotIdx < slots.length - 1) {
    return { slotIdx: currentSlotIdx + 1, date: currentDate };
  } else {
    return { slotIdx: 0, date: addMinutes(new Date(currentDate), 24 * 60) };
  }
}

// Helper: Check for show conflicts
async function hasConflict(screenId, startTime, endTime) {
  return await Show.exists({
    screenId,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
  });
}

// Helper: Check for slot conflict (same slot, date, and screen)
async function slotConflict(screenId, slot, date) {
  const conflict = await Show.findOne({
    screenId,
    startTime: {
      $gte: new Date(date + "T00:00:00.000Z"),
      $lt: new Date(date + "T23:59:59.999Z"),
    },
    "timeSlot.label": slot.label,
    "timeSlot.time": slot.time,
  });
  return !!conflict;
}

module.exports = {
  getNextSlotAndDate,
  hasConflict,
  slotConflict,
  findAvailableSlot,
};
