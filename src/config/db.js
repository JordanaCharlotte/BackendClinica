// Conexión a PostgreSQL (Amazon RDS) usando los datos del archivo .env
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },                      // la RDS exige conexión cifrada
  options: `-c search_path=${process.env.DB_SCHEMA},public`, // usa el esquema "app"
});

module.exports = pool;