// routes/paymentsRoutes.js
const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/paymentsController");

// Routes
router.post("/initiate", paymentsController.initiatePayment);
router.post("/confirm/:id", paymentsController.confirmPayment);
router.get("/user/:user_id", paymentsController.getUserPayments);

module.exports = router;
