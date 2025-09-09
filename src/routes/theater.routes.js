const express = require("express");
const router = express.Router();

const create = require("../controllers/theater/create.controller");
const getTheaters = require("../controllers/theater/view.controller");

// Custom Middlwares
const checkAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/create", checkAuth, isAdmin, create);
router.get("/view", getTheaters);

module.exports = router;
