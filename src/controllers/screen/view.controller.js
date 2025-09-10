const Screen = require("../../models/screen/screen.model");

const viewScreens = async (req, res) => {
  try {
    const { theaterId } = req.params;
    const { name } = req.query; // e.g. ?name=Screen 1

    if (!theaterId) {
      return res.status(400).json({ error: "Theater ID is required" });
    }

    const filter = { theaterId };
    if (name) filter.name = name;

    const screens = await Screen.find(filter).sort({ name: 1 });

    res.status(200).json({
      message: "Screens retrieved successfully",
      count: screens.length,
      screens,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = viewScreens;
