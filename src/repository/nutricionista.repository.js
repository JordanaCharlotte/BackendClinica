import pool from '../config/db.js';

export async function buscarTodosLosNutricionistas() {
  const { rows } = await pool.query(
    `SELECT
       id,
       nombre,
       especialidad,
       dias,
       horario
     FROM nutricionistas
     ORDER BY nombre`,
  );

  return rows;
}

export async function buscarNutricionistaPorId(id) {
  const { rows } = await pool.query(
    `SELECT
       id,
       nombre,
       especialidad,
       dias,
       horario
     FROM nutricionistas
     WHERE id = $1`,
    [id],
  );

  return rows[0] ?? null;
}
