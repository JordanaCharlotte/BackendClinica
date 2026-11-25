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

export async function crearNutricionista({
  id,
  nombre,
  especialidad,
  dias,
  horario,
}) {
  const { rows } = await pool.query(
    `INSERT INTO nutricionistas (
       id,
       nombre,
       especialidad,
       dias,
       horario
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
       id,
       nombre,
       especialidad,
       dias,
       horario`,
    [id, nombre, especialidad, dias, horario],
  );

  return rows[0];
}

export async function actualizarNutricionista(id, datos) {
  const {
    nombre,
    especialidad,
    dias,
    horario,
  } = datos;

  const { rows } = await pool.query(
    `UPDATE nutricionistas
     SET nombre = COALESCE($1, nombre),
         especialidad = COALESCE($2, especialidad),
         dias = COALESCE($3, dias),
         horario = COALESCE($4, horario)
     WHERE id = $5
     RETURNING
       id,
       nombre,
       especialidad,
       dias,
       horario`,
    [
      nombre ?? null,
      especialidad ?? null,
      dias ?? null,
      horario ?? null,
      id,
    ],
  );

  return rows[0] ?? null;
}

export async function eliminarNutricionista(id) {
  const resultado = await pool.query(
    'DELETE FROM nutricionistas WHERE id = $1',
    [id],
  );

  return resultado.rowCount > 0;
}
