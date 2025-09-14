const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// Driver Register
// =======================
const registerDriver = async (req, res) => {
  try {
    const { user_id, license_no, vehicle_no } = req.body;

    // Ensure user exists
    const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    // Insert into drivers
    const result = await pool.query(
      `INSERT INTO drivers (user_id, license_no, vehicle_no) 
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, license_no, vehicle_no]
    );

    res.status(201).json({
      message: "Driver registered successfully",
      driver: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// Driver Login
// =======================
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT d.driver_id, d.user_id, u.password, u.email, u.role
       FROM drivers d 
       JOIN users u ON d.user_id = u.id 
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const driver = result.rows[0];

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { driver_id: driver.driver_id, user_id: driver.user_id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Driver login successful",
      token,
      driver: {
        driver_id: driver.driver_id,
        user_id: driver.user_id,
        email: driver.email,
        role: driver.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// Get Available Rides
const getAvailableRides = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT ride_id, pickup, dropoff, fare, status FROM rides WHERE status = 'pending'"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =======================
// Accept Ride
// =======================
const acceptRide = async (req, res) => {
  try {
    const { ride_id } = req.body;
    const driverId = req.driver?.driver_id;

    if (!driverId) {
      return res.status(403).json({ error: "Driver authentication failed" });
    }

    const result = await pool.query(
      "UPDATE rides SET driver_id = $1, status = 'ongoing' WHERE ride_id = $2 RETURNING *",
      [driverId, ride_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({ message: "Ride accepted successfully", ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =======================
// Complete Ride
// =======================
const completeRide = async (req, res) => {
  try {
    const { ride_id } = req.body;
    const driverId = req.driver?.driver_id;

    if (!driverId) {
      return res.status(403).json({ error: "Driver authentication failed" });
    }

    const result = await pool.query(
      `UPDATE rides 
       SET status='completed' 
       WHERE ride_id=$1 AND driver_id=$2 
       RETURNING *`,
      [ride_id, driverId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ride not found or not assigned to this driver" });
    }

    res.json({ message: "Ride completed", ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { registerDriver, loginDriver, getAvailableRides, acceptRide, completeRide };
