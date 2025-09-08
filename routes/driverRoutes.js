// routes/driverRoutes.js
const express = require("express");
const { registerDriver, loginDriver, getAvailableRides, acceptRide, completeRide } = require("../controllers/driverController");
const { authenticateDriver } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);



// protected routes (driver must be logged in)
router.get("/rides", authenticateDriver, getAvailableRides);
router.post("/accept", authenticateDriver, acceptRide);
router.post("/complete", authenticateDriver, completeRide);

module.exports = router;
