const Show = require("../models/show/show.model");

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

module.exports = { getNextSlotAndDate, hasConflict };
