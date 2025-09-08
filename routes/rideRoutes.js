const express = require("express");
const router = express.Router();
const { bookRide } = require("../controllers/rideController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getMyRides } = require("../controllers/rideController");

router.post("/book-ride", authMiddleware, bookRide);
router.get("/my-rides",authMiddleware,getMyRides);

module.exports = router;
