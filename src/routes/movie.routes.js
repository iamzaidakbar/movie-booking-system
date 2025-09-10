const express = require("express");
const router = express.Router();

const addMovie = require("../controllers/movie/add.controller");
const viewMovies = require("../controllers/movie/view.controllers");

// Custom Middlwares
const checkAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/add", checkAuth, isAdmin, addMovie);
router.get("/view", viewMovies);

module.exports = router;
