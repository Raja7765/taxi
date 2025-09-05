// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");

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
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("🚖 Taxi Booking Backend is running...");
});

// Future routes (auth, rides, drivers) will go here
// const authRoutes = require("./routes/auth");
// app.use("/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});

module.exports = app;
