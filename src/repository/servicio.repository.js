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

export async function crearServicio({
  codigo,
  categoria,
  nombre,
  duracion,
  modalidad,
  profesional,
  precio,
  precioAnterior,
  oferta,
  disponibilidad,
  cupos,
  descripcion,
}) {
  const { rows } = await pool.query(
    `INSERT INTO servicios (
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
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING
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
       descripcion`,
    [
      codigo,
      categoria,
      nombre,
      duracion,
      modalidad,
      profesional,
      precio,
      precioAnterior,
      oferta,
      disponibilidad,
      cupos,
      descripcion,
    ],
  );

  return rows[0];
}

export async function actualizarServicio(id, datos) {
  const {
    codigo,
    categoria,
    nombre,
    duracion,
    modalidad,
    profesional,
    precio,
    precioAnterior,
    oferta,
    disponibilidad,
    cupos,
    descripcion,
  } = datos;

  const { rows } = await pool.query(
    `UPDATE servicios
     SET codigo = COALESCE($1, codigo),
         categoria = COALESCE($2, categoria),
         nombre = COALESCE($3, nombre),
         duracion = COALESCE($4, duracion),
         modalidad = COALESCE($5, modalidad),
         profesional = COALESCE($6, profesional),
         precio = COALESCE($7, precio),
         precio_anterior = COALESCE($8, precio_anterior),
         oferta = COALESCE($9, oferta),
         disponibilidad = COALESCE($10, disponibilidad),
         cupos = COALESCE($11, cupos),
         descripcion = COALESCE($12, descripcion)
     WHERE id = $13
     RETURNING
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
       descripcion`,
    [
      codigo ?? null,
      categoria ?? null,
      nombre ?? null,
      duracion ?? null,
      modalidad ?? null,
      profesional ?? null,
      precio ?? null,
      precioAnterior ?? null,
      oferta ?? null,
      disponibilidad ?? null,
      cupos ?? null,
      descripcion ?? null,
      id,
    ],
  );

  return rows[0] ?? null;
}

export async function eliminarServicio(id) {
  const resultado = await pool.query(
    'DELETE FROM servicios WHERE id = $1',
    [id],
  );

  return resultado.rowCount > 0;
}
