import pool from '../config/db.js';

export async function crearCita({
  usuarioId,
  servicioId,
  nutricionistaId,
  fecha,
  hora,
  nombre,
  correo,
  precio,
}) {
  const { rows } = await pool.query(
    `INSERT INTO citas
      (usuario_id, servicio_id, nutricionista_id, fecha, hora, nombre, correo, precio)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING
       id,
       usuario_id,
       servicio_id,
       nutricionista_id,
       fecha::text AS fecha,
       hora,
       nombre,
       correo,
       precio,
       estado`,
    [
      usuarioId,
      servicioId,
      nutricionistaId,
      fecha,
      hora,
      nombre,
      correo,
      precio,
    ],
  );

  return rows[0];
}

export async function buscarCitasPorUsuario(usuarioId) {
  const { rows } = await pool.query(
    `SELECT
       c.id,
       c.usuario_id,
       c.servicio_id,
       s.nombre AS servicio,
       c.nutricionista_id,
       n.nombre AS nutricionista,
       c.fecha::text AS fecha,
       c.hora,
       c.nombre,
       c.correo,
       c.precio,
       c.estado
     FROM citas c
     INNER JOIN servicios s ON s.id = c.servicio_id
     INNER JOIN nutricionistas n ON n.id = c.nutricionista_id
     WHERE c.usuario_id = $1
     ORDER BY c.fecha, c.hora`,
    [usuarioId],
  );

  return rows;
}

export async function buscarTodasLasCitas() {
  const { rows } = await pool.query(
    `SELECT
       c.id,
       c.usuario_id,
       u.nombre AS usuario,
       u.correo AS usuario_correo,
       c.servicio_id,
       s.nombre AS servicio,
       c.nutricionista_id,
       n.nombre AS nutricionista,
       c.fecha::text AS fecha,
       c.hora,
       c.nombre,
       c.correo,
       c.precio,
       c.estado
     FROM citas c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     INNER JOIN servicios s ON s.id = c.servicio_id
     INNER JOIN nutricionistas n ON n.id = c.nutricionista_id
     ORDER BY c.fecha, c.hora`,
  );

  return rows;
}

export async function existeHorario(
  nutricionistaId,
  fecha,
  hora,
  idExcluir = null,
) {
  const resultado = await pool.query(
    'SELECT id ' +
      'FROM citas ' +
      'WHERE nutricionista_id = $1 ' +
      'AND fecha = $2 ' +
      'AND hora = $3 ' +
      'AND estado <> $4 ' +
      'AND ($5::integer IS NULL OR id <> $5::integer)',
    [
      nutricionistaId,
      fecha,
      hora,
      'cancelada',
      idExcluir,
    ],
  );

  return resultado.rows.length > 0;
}


export async function buscarCitaPorId(id) {
  const { rows } = await pool.query(
    `SELECT
       c.id,
       c.usuario_id,
       c.servicio_id,
       s.nombre AS servicio,
       c.nutricionista_id,
       n.nombre AS nutricionista,
       c.fecha::text AS fecha,
       c.hora,
       c.nombre,
       c.correo,
       c.precio,
       c.estado
     FROM citas c
     INNER JOIN servicios s ON s.id = c.servicio_id
     INNER JOIN nutricionistas n ON n.id = c.nutricionista_id
     WHERE c.id = $1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function actualizarCita(id, { fecha, hora, estado }) {
  const { rows } = await pool.query(
    `UPDATE citas
     SET fecha = COALESCE($1, fecha),
         hora = COALESCE($2, hora),
         estado = COALESCE($3, estado)
     WHERE id = $4
     RETURNING
       id,
       usuario_id,
       servicio_id,
       nutricionista_id,
       fecha::text AS fecha,
       hora,
       nombre,
       correo,
       precio,
       estado`,
    [fecha ?? null, hora ?? null, estado ?? null, id],
  );

  return rows[0] ?? null;
}