const Theater = require("../../models/theater/theater.model");

const getTheaters = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  try {
    const { id, theaterId, city, name, address } = req.query;

    const filter = {};

    // ID filter (supports `id` or `theaterId`)
    const idCandidate = (id || theaterId || "").trim();
    if (idCandidate) {
      filter._id = idCandidate;
    }

    if (city && city.trim()) {
      filter.city = { $regex: new RegExp(`^${city.trim()}$`, "i") };
    }

    if (name && name.trim()) {
      filter.name = { $regex: new RegExp(name.trim(), "i") };
    }

    if (address && address.trim()) {
      filter.address = { $regex: new RegExp(address.trim(), "i") };
    }

    const [theaters, total] = await Promise.all([
      Theater.find(filter)
        .select("-__v -createdAt -updatedAt")
        .skip(skip)
        .limit(limit),
      Theater.countDocuments(filter),
    ]);

    res.status(200).json({
      message: theaters.length
        ? "Theaters retrieved successfully."
        : "No theaters found with the given filters.",
      theaters,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get theaters error:", err);
    res.status(500).json({
      message: "Failed to retrieve theaters.",
      error: err.message,
    });
  }
};

module.exports = getTheaters ;
