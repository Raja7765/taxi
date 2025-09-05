const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
