const pool = require("../config/db");

// Simple fare generator (random for now)
function calculateFare() {
  return (Math.random() * (500 - 100) + 100).toFixed(2); // between 100–500
}

// Book Ride
const bookRide = async (req, res) => {
  const { pickup, dropoff } = req.body;
  const userId = req.user.id; // from JWT

  try {
    //  Step 1: validate rider
    const riderCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'rider'",
      [userId]
    );

    if (riderCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid rider or user does not exist" });
    }

    //  Step 2: calculate fare
    const fare = calculateFare();

    //  Step 3: insert ride
    const result = await pool.query(
      "INSERT INTO rides (user_id, pickup, dropoff, fare, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, pickup, dropoff, fare, "pending"]
    );

    res.status(201).json({ message: "Ride booked successfully", ride: result.rows[0] });
  } catch (err) {
    console.error("Book Ride Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};




// get all rides for login rider
const getMyRides = async (req,res) => {
    const riderId = req.user.id;
    try{
        const result = await pool.query(
            "SELECT * FROM rides WHERE rider_id = $1 ORDER BY created_at DESC",
            [riderId]
        );

        res.json({ rides: result.rows});
    } catch (err){
        res.status(500).json({error: err.message});
    }
};


module.exports = { bookRide,getMyRides};