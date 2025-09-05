// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Load environment variables
dotenv.config();
const app = express();


// Middleware
app.use(express.json());





// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Example: postgres://user:pass@localhost:5432/taxi_db
});






// Test DB connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error(" DB connection error:", err));






// Example route
app.get("/", (req, res) => {
  res.send("Taxi Booking Backend is running...");
})

// Signup
app.post("/signup", async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name,email,password,role,phone) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [name, email, hashedPassword, role, phone]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0]; 

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } 
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log( `Server running on ${PORT}`);
});





module.exports = app;
