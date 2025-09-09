/**
 * Generate seats for a screen based on rows and columns
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {Array} Array of seat objects
 */
const generateSeats = (rows, cols) => {
  const seats = [];

  // Function to get seat type based on row letter
  const getSeatType = (rowLetter) => {
    switch (rowLetter) {
      case "A":
        return "royalClub";
      case "B":
        return "royal";
      case "C":
        return "regular";
      default:
        return "basic";
    }
  };

  for (let row = 1; row <= rows; row++) {
    const rowLetter = String.fromCharCode(64 + row);
    const seatType = getSeatType(rowLetter);

    for (let col = 1; col <= cols; col++) {
      const seatNumber = `${rowLetter}${col}`;
      seats.push({
        seatNumber,
        row: rowLetter,
        col,
        type: seatType,
        status: "available",
      });
    }
  }

  return seats;
};

module.exports = generateSeats;
