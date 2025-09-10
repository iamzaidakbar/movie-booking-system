const Movie = require("../../models/movie/movie.models");

const viewMovies = async (req, res) => {
  try {
    const {
      title,
      language,
      genre,
      minRating,
      maxRating,
      sortBy,
      sortOrder = "asc",
    } = req.query;

    const filter = {};

    // Filter by title (partial match)
    if (title) {
      filter.title = { $regex: title, $options: "i" }; // case-insensitive
    }

    // Filter by language
    if (language) {
      filter.language = language;
    }

    // Filter by genre (movies containing at least one of the specified genres)
    if (genre) {
      // allow multiple genres comma separated
      const genresArray = genre.split(",").map((g) => g.trim());
      filter.genres = { $in: genresArray };
    }

    // Filter by rating
    if (minRating || maxRating) {
      filter["rating.score"] = {};
      if (minRating) filter["rating.score"].$gte = Number(minRating);
      if (maxRating) filter["rating.score"].$lte = Number(maxRating);
    }

    // Sorting
    const sortOptions = {};
    if (sortBy) {
      // e.g., sortBy=releaseDate, sortOrder=desc
      sortOptions[sortBy] = sortOrder.toLowerCase() === "desc" ? -1 : 1;
    }

    const movies = await Movie.find(filter).sort(sortOptions);

    // if no movies found, return a message
    if (movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found matching the criteria." });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = viewMovies;
