const express = require("express");
const router = express.Router();

const createScreen = require("../controllers/screen/create.controller");
const viewScreens = require("../controllers/screen/view.controller");

// Custom Middlwares
const checkAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/create", checkAuth, isAdmin, createScreen);
router.get("/view/:theaterId", checkAuth, viewScreens);

module.exports = router;
