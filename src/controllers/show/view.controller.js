const Show = require("../../models/show/show.model");

// Get shows with advanced filtering
const getShows = async (req, res) => {
  try {
    const {
      movieId,
      theaterId,
      screenId,
      date,
      status,
      city,
      movieTitle,
      page = 1,
      limit = 20,
      sortBy = "startTime",
      sortOrder = "asc"
    } = req.query;

    const filter = {};
    const currentDate = new Date();

    // Filter by movie
    if (movieId) filter.movieId = movieId;
    if (movieTitle) filter.movieTitle = { $regex: movieTitle, $options: "i" };

    // Filter by location
    if (theaterId) filter.theaterId = theaterId;
    if (screenId) filter.screenId = screenId;

    // Filter by date
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      filter.startTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    } else {
      // Default: only show upcoming and active shows
      filter.status = { $in: ["SCHEDULED", "ACTIVE"] };
      filter.startTime = { $gte: currentDate };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder.toLowerCase() === "desc" ? -1 : 1;

    const [shows, total] = await Promise.all([
      Show.find(filter)
        .populate("movieId", "title posterUrl duration language genres certification")
        .populate("theaterId", "name address city")
        .populate("screenId", "name")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Show.countDocuments(filter)
    ]);

    // Group shows by movie and theater for better UX
    const groupedShows = shows.reduce((acc, show) => {
      const movieKey = show.movieId._id.toString();
      if (!acc[movieKey]) {
        acc[movieKey] = {
          movie: show.movieId,
          theaters: {}
        };
      }
      
      const theaterKey = show.theaterId._id.toString();
      if (!acc[movieKey].theaters[theaterKey]) {
        acc[movieKey].theaters[theaterKey] = {
          theater: show.theaterId,
          shows: []
        };
      }
      
      acc[movieKey].theaters[theaterKey].shows.push({
        _id: show._id,
        screenName: show.screenName,
        startTime: show.startTime,
        endTime: show.endTime,
        price: show.price,
        availableSeats: show.availableSeats,
        totalSeats: show.seats,
        status: show.status,
        timeSlot: show.timeSlot
      });
      
      return acc;
    }, {});

    res.status(200).json({
      message: "Shows retrieved successfully",
      shows: Object.values(groupedShows),
      flatShows: shows, // Also provide flat list
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error("Get shows error:", error);
    res.status(500).json({
      message: "Failed to retrieve shows",
      error: error.message
    });
  }
};

// Get shows by movie and location
const getShowsByMovieAndLocation = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { city, date, theaterId } = req.query;

    const filter = { movieId, status: { $in: ["SCHEDULED", "ACTIVE"] } };
    
    // Date filter
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      // Default to today and future
      filter.startTime = { $gte: new Date() };
    }

    if (theaterId) filter.theaterId = theaterId;

    const shows = await Show.find(filter)
      .populate("theaterId", "name address city")
      .populate("screenId", "name")
      .sort({ startTime: 1 });

    // Filter by city if provided (after population)
    const filteredShows = city 
      ? shows.filter(show => show.theaterId.city.toLowerCase() === city.toLowerCase())
      : shows;

    // Group by theater
    const theaterGroups = filteredShows.reduce((acc, show) => {
      const theaterId = show.theaterId._id.toString();
      if (!acc[theaterId]) {
        acc[theaterId] = {
          theater: show.theaterId,
          shows: []
        };
      }
      acc[theaterId].shows.push({
        _id: show._id,
        screenName: show.screenName,
        startTime: show.startTime,
        price: show.price,
        availableSeats: show.availableSeats,
        timeSlot: show.timeSlot
      });
      return acc;
    }, {});

    res.status(200).json({
      message: "Shows by movie and location retrieved successfully",
      theaters: Object.values(theaterGroups)
    });

  } catch (error) {
    console.error("Get shows by movie error:", error);
    res.status(500).json({
      message: "Failed to retrieve shows",
      error: error.message
    });
  }
};

module.exports = {
  getShows,
  getShowsByMovieAndLocation
};
