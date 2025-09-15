const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");
const driverRoutes = require("./routes/driverRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes")


const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rides", require("./routes/rideRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/payments", require("./routes/paymentsRoutes"))




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
