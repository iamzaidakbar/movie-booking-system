const Show = require("../models/show/show.model");

// Run every minute to update show statuses
async function updateShowStatuses() {
  const now = new Date();

  // 1. SCHEDULED → ACTIVE
  await Show.updateMany(
    {
      status: "SCHEDULED",
      startTime: { $lte: now },
    },
    { $set: { status: "ACTIVE" } }
  );

  // 2. ACTIVE → ENDED
  await Show.updateMany(
    {
      status: "ACTIVE",
      endTime: { $lte: now },
    },
    { $set: { status: "ENDED" } }
  );
}

// Use cron npm package to run every minute
const { CronJob } = require("cron");
const job = new CronJob("*/1 * * * *", () => {
  console.log(
    "Running show status update cron job at",
    new Date().toISOString()
  );
  updateShowStatuses().catch((err) => console.error("Cron job error:", err));
});
job.start();

module.exports = updateShowStatuses;
