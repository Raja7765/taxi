const pool = require("../config/db");

// Simple fare generator (random for now)
function calculateFare() {
  return (Math.random() * (500 - 100) + 100).toFixed(2); // between 100–500
}

// Book Ride
exports.bookRide = async (req, res) => {
  const { pickup, dropoff } = req.body;
  const riderId = req.user.id; // from JWT
  try {
    const fare = calculateFare();
    const result = await pool.query(
      "INSERT INTO rides (rider_id, pickup, dropoff, fare, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [riderId, pickup, dropoff, fare, "requested"]
    );

    res.status(201).json({ message: "Ride booked successfully", ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
