const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log(" Database connected"))
  .catch(err => console.error(" Database connection error", err));

module.exports = pool;
