const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: process.env.DB_MIN_CONN,
  min: process.env.DB_MAX_CONN,
});

module.exports = {
  pool,
};