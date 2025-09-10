const express = require("express");
const router = express.Router();

const addMovie = require("../controllers/movie/add.controller");

// Custom Middlwares
const checkAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/add", checkAuth, isAdmin, addMovie);

module.exports = router;
