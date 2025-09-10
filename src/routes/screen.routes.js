const express = require("express");
const router = express.Router();

const createScreen = require("../controllers/screen/create.controller");

// Custom Middlwares
const checkAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/create", checkAuth, isAdmin, createScreen);

module.exports = router;
