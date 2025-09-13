// controllers/paymentsController.js
const pool = require("../config/db");

// Initiate a payment when ride is completed
exports.initiatePayment = async (req, res) => {
  try {
    const { ride_id, user_id, amount } = req.body;

    const result = await pool.query(
      `INSERT INTO payments (ride_id, user_id, amount, status, created_at)
       VALUES ($1, $2, $3, 'pending', NOW())
       RETURNING *`,
      [ride_id, user_id, amount]
    );

    res.status(201).json({ message: "Payment initiated", payment: result.rows[0] });
  } catch (err) {
    console.error("Error initiating payment:", err.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};




// Confirm payment (cash/online)
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE payments SET status = 'paid', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ message: "Payment confirmed", payment: result.rows[0] });
  } catch (err) {
    console.error("Error confirming payment:", err.message);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
};





// Get user payment history
exports.getUserPayments = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching payments:", err.message);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};
