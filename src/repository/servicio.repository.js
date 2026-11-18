import pool from '../config/db.js';

export async function buscarTodosLosServicios() {
  const { rows } = await pool.query(
    `SELECT
       id,
       codigo,
       categoria,
       nombre,
       duracion,
       modalidad,
       profesional,
       precio,
       precio_anterior,
       oferta,
       disponibilidad,
       cupos,
       descripcion
     FROM servicios
     ORDER BY id`,
  );

  return rows;
}

export async function buscarServicioPorId(id) {
  const { rows } = await pool.query(
    `SELECT
       id,
       codigo,
       categoria,
       nombre,
       duracion,
       modalidad,
       profesional,
       precio,
       precio_anterior,
       oferta,
       disponibilidad,
       cupos,
       descripcion
     FROM servicios
     WHERE id = $1`,
    [id],
  );

  return rows[0] ?? null;
}
