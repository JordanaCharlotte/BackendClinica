// Carga en la RDS los datos iniciales del frontend (src/data/).
// Las contraseñas se guardan con hash Argon2id, nunca en texto plano.
// Se puede ejecutar varias veces: si un dato ya existe, no lo duplica.
import argon2 from 'argon2';
import pool from '../src/config/db.js';
import usuarios from './data/usuarios.js';
import servicios from './data/servicios.js';
import nutricionistas from './data/nutricionistas.js';

async function cargar() {
  for (const n of nutricionistas) {
    await pool.query(
      `INSERT INTO nutricionistas (id, nombre, especialidad, dias, horario)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
      [n.id, n.nombre, n.especialidad, n.dias, n.horario],
    );
  }

  for (const s of servicios) {
    await pool.query(
      `INSERT INTO servicios (codigo, categoria, nombre, duracion, modalidad, profesional,
         precio, precio_anterior, oferta, disponibilidad, cupos, descripcion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (codigo) DO NOTHING`,
      [s.codigo, s.categoria, s.nombre, s.duracion, s.modalidad, s.profesional,
        s.precio, s.precioAnterior, s.oferta, s.disponibilidad, s.cupos, s.descripcion],
    );
  }

  for (const u of usuarios) {
    const hash = await argon2.hash(u.password);
    await pool.query(
      `INSERT INTO usuarios (run, nombre, apellidos, correo, telefono, password_hash, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (correo) DO NOTHING`,
      [u.run, u.nombre, u.apellidos, u.correo, u.telefono, hash, u.rol],
    );
  }

  console.log(`Cargados: ${nutricionistas.length} nutricionistas, ${servicios.length} servicios, ${usuarios.length} usuarios.`);
  await pool.end();
}

cargar();