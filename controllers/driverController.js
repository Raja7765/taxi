const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")



//Driver register
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



// Driver Login
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT d.driver_id, d.user_id, u.password 
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

    res.json({ message: "Driver login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





//  Get Available Rides
const getAvailableRides = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rides WHERE status='requested'");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//accepting the ride


const acceptRide = async (req, res) => {
  try {
    if (!req.body || !req.body.ride_id) {
      return res.status(400).json({ error: "ride_id is required in request body" });
    }

    const { ride_id } = req.body;
    const driver_id = req.driver?.driver_id;

    if (!driver_id) {
      return res.status(403).json({ error: "Driver authentication failed" });
    }

    // Update ride status
    await pool.query(
      "UPDATE rides SET driver_id = $1, status = 'accepted' WHERE ride_id = $2",
      [driver_id, ride_id]
    );

    res.json({ message: "Ride accepted successfully", ride_id, driver_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





//  Complete Ride
const completeRide = async (req, res) => {
  const { ride_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE rides SET status='completed' WHERE ride_id=$1 RETURNING *",
      [ride_id]
    );
    res.json({ message: "Ride completed", ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerDriver, loginDriver, getAvailableRides, acceptRide, completeRide };