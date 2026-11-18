// Consultas a la tabla usuarios.
import pool from '../config/db.js';

// Para el login: trae también el hash de la contraseña.
export async function buscarPorCorreo(correo) {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
  return rows[0] ?? null;
}

// Revisa si el correo ya está usado. excluirId sirve al editar, para no chocar consigo mismo.
// 0 = no excluir a nadie (los id parten en 1).
export async function existeCorreo(correo, excluirId = 0) {
  const { rows } = await pool.query('SELECT 1 FROM usuarios WHERE correo = $1 AND id <> $2', [correo, excluirId]);
  return rows.length > 0;
}

// Igual que existeCorreo, pero con el RUN.
export async function existeRun(run, excluirId = 0) {
  const { rows } = await pool.query('SELECT 1 FROM usuarios WHERE run = $1 AND id <> $2', [run, excluirId]);
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

// Lista todos los usuarios, sin la contraseña.
export async function listarUsuarios() {
  const { rows } = await pool.query(
    'SELECT id, run, nombre, apellidos, correo, telefono, rol FROM usuarios ORDER BY id',
  );
  return rows;
}

// Edita un usuario. Si passwordHash viene vacío (null), se mantiene la contraseña actual.
export async function actualizarUsuario(id, { run, nombre, apellidos, correo, telefono, rol, passwordHash }) {
  const { rows } = await pool.query(
    `UPDATE usuarios
     SET run = $2, nombre = $3, apellidos = $4, correo = $5, telefono = $6, rol = $7,
         password_hash = COALESCE($8, password_hash)
     WHERE id = $1
     RETURNING id, run, nombre, apellidos, correo, telefono, rol`,
    [id, run, nombre, apellidos, correo, telefono, rol, passwordHash],
  );
  return rows[0] ?? null;
}

// Cuántos administradores hay (para no borrar al único).
export async function contarAdmins() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM usuarios WHERE rol = 'admin'");
  return rows[0].total;
}

export async function eliminarUsuario(id) {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
}
