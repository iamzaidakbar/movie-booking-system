const Theater = require("../../models/theater/theater.model");

const createTheater = async (req, res) => {
  const { name, city, address } = req.body;

  if (!name || !city || !address) {
    return res
      .status(400)
      .json({ message: "(Name, City and Address) fields are required!" });
  }

  // Check if the theater with same name is already present in DB.
  const isPresent = await Theater.find({ name: name, city: city });

  if (isPresent) {
    return res
      .status(400)
      .json({ error: `A Theater named ${name} already exists in ${city}` });
  }

  // Logic to create a theater
  const theater = await Theater.create({ name, city, address });
  res.status(201).json({ message: "Theater created successfully", theater });
};

module.exports = createTheater;
