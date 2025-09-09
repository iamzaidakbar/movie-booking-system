const isAdmin = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "User not found!" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next(); // ✅ allow request to continue if user is admin
};

module.exports = isAdmin;
