require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const listenPort = require("./config/listenPort");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Middlewares
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use("/auth", require("./routes/auth.routes"));

// Listen on
listenPort(app);

module.exports = app;
