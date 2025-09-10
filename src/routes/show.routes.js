const express = require("express");
const router = express.Router();

const scheduleShow = require("../controllers/show/schedule.controller");

// Custom Middlwares
const checkAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/schedule", checkAuth, isAdmin, scheduleShow);

module.exports = router;
