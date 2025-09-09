const User = require("../../models/auth/user.model");
const bcrypt = require("bcrypt");
const cookieOptions = require("../../utils/cookieOptions");
const generateToken = require("../../utils/generateToken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password); // ✅ compare with stored hash
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", message: err.message });
  }
};

module.exports = login;
