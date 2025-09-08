const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


// Driver Registration
const registerDriver = async (req, res) => {
  const { name, email, password, license_number, vehicle_number } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO drivers (name,email,password,license_number,vehicle_number,status) VALUES ($1,$2,$3,$4,$5,'available') RETURNING *",
      [name, email, hashedPassword, license_number, vehicle_number]
    );

    res.status(201).json({ message: "Driver registered", driver: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




//  Driver Login
const loginDriver = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM drivers WHERE email=$1", [email]);
    const driver = result.rows[0];
    if (!driver) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: driver.id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// 🚖 Get Available Rides
const getAvailableRides = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rides WHERE status='requested'");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






//  Accept Ride
const acceptRide = async (req, res) => {
  const { ride_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE rides SET driver_id=$1, status='accepted' WHERE ride_id=$2 RETURNING *",
      [req.driver.id, ride_id]
    );
    res.json({ message: "Ride accepted", ride: result.rows[0] });
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