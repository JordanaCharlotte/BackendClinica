// Responde si la API está funcionando y si llega a la base de datos
const pool = require('../config/db');

function estado(req, res) {
  res.json({ status: 'ok', servicio: 'BackendClinica' });
}

async function baseDeDatos(req, res) {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'conectada' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'sin conexión' });
  }
}

module.exports = { estado, baseDeDatos };