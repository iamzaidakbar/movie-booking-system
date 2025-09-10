const Movie = require("../../models/movie/movie.models");
const { parse, format } = require("date-fns");

const addMovie = async (req, res) => {
  const {
    title,
    posterUrl,
    bannerUrl,
    trailerUrl,
    description,
    duration,
    genres,
    language,
    format: movieFormat,
    certification,
    releaseDate,
    rating: { score, votes },
  } = req.body;

  if (
    !title ||
    !posterUrl ||
    !bannerUrl ||
    !trailerUrl ||
    !description ||
    !duration ||
    !genres ||
    !language ||
    !movieFormat ||
    !certification ||
    !releaseDate
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  // check if movie with same title already exists
  const existingMovie = await Movie.findOne({ title });
  if (existingMovie) {
    return res
      .status(400)
      .json({ message: "Movie with this title already exists." });
  }

  try {
    const parsedDate = parse(releaseDate, "d MMM, yyyy", new Date());

    const newMovie = new Movie({
      title,
      posterUrl,
      bannerUrl,
      trailerUrl,
      description,
      duration,
      genres,
      language,
      format: movieFormat,
      certification,
      releaseDate: parsedDate,
      rating: { score, votes },
    });

    await newMovie.save();

    // Send response with formatted releaseDate
    res.status(201).json({
      message: "Movie added successfully.",
      movie: {
        ...newMovie._doc,
        releaseDate: format(newMovie.releaseDate, "d MMM, yyyy"),
      },
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = addMovie;
