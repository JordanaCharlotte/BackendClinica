// Responde si la API está funcionando y si llega a la base de datos.
import pool from '../config/db.js';

export function estado(req, res) {
  res.json({ status: 'ok', servicio: 'BackendClinica' });
}

export async function baseDeDatos(req, res) {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'conectada' });
  } catch {
    res.status(503).json({ status: 'error', database: 'sin conexión' });
  }
}