// Consultas a la tabla usuarios.
import pool from '../config/db.js';

// Para el login: trae también el hash de la contraseña.
export async function buscarPorCorreo(correo) {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
  return rows[0] ?? null;
}

export async function existeCorreo(correo) {
  const { rows } = await pool.query('SELECT 1 FROM usuarios WHERE correo = $1', [correo]);
  return rows.length > 0;
}

export async function existeRun(run) {
  const { rows } = await pool.query('SELECT 1 FROM usuarios WHERE run = $1', [run]);
  return rows.length > 0;
}

export async function crearUsuario({ run, nombre, apellidos, correo, telefono, passwordHash, rol }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (run, nombre, apellidos, correo, telefono, password_hash, rol)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, run, nombre, apellidos, correo, telefono, rol`,
    [run, nombre, apellidos, correo, telefono, passwordHash, rol],
  );
  return rows[0];
}

// Para /me: datos del usuario sin la contraseña.
export async function buscarPorId(id) {
  const { rows } = await pool.query(
    'SELECT id, run, nombre, apellidos, correo, telefono, rol FROM usuarios WHERE id = $1',
    [id],
  );
  return rows[0] ?? null;
}
