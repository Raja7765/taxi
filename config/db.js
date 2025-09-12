const { Pool } = require("pg");
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";



const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE,
  ...(isProduction ? {ssl:{ rejectUnauthorized: false}} :{})
});

pool.connect()
  .then(() => console.log(" Database connected"))
  .catch(err => console.error(" Database connection error", err));

module.exports = pool;
