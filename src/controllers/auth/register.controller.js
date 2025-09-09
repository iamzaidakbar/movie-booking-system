const User = require("../../models/auth/user.model");
const bcrypt = require("bcrypt");
const cookieOptions = require("../../utils/cookieOptions");
const generateToken = require("../../utils/generateToken");

const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: user.role,
    }); // ✅ password field

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

module.exports = register;
