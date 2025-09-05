const express = require("express");
const router = express.Router();
const { bookRide } = require("../controllers/rideController");
const authMiddleware = require("../middleware/authmiddleware");

router.post("/book-ride", authMiddleware, bookRide);

module.exports = router;
