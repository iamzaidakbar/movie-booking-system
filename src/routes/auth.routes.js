const express = require("express");
const router = express.Router();

const register = require("../controllers/auth/register.controller");
const login = require("../controllers/auth/login.controller");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
