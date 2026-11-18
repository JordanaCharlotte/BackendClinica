// Lógica para que el administrador liste, modifique y elimine usuarios.
// Mismos nombres, reglas y mensajes que authService.js del frontend.
import bcrypt from 'bcrypt';
import * as Usuario from '../repository/usuario.repository.js';
import { formatearRun } from '../validator/validaciones.js';

export async function listarUsuarios() {
  return Usuario.listarUsuarios();
}

// Edita un usuario existente.
export async function actualizarUsuario(id, cambios) {
  const actual = await Usuario.buscarPorId(id);
  if (!actual) return { ok: false, estado: 404, error: 'El usuario no existe.' };

  const datos = {
    run: formatearRun(cambios.run),
    nombre: cambios.nombre.trim(),
    apellidos: cambios.apellidos.trim(),
    correo: cambios.correo.trim().toLowerCase(),
    telefono: String(cambios.telefono ?? '').replace(/\s/g, ''),
    rol: cambios.rol === 'admin' ? 'admin' : 'cliente',
    // Contraseña vacía = mantener la actual.
    passwordHash: cambios.password ? await bcrypt.hash(cambios.password, 10) : null,
  };

  if (await Usuario.existeCorreo(datos.correo, id)) {
    return { ok: false, estado: 409, error: 'Ya existe una cuenta con ese correo.', campo: 'correo' };
  }
  if (await Usuario.existeRun(datos.run, id)) {
    return { ok: false, estado: 409, error: 'Ya existe una cuenta con ese RUN.', campo: 'run' };
  }

  // No dejar a la clínica sin administradores.
  if (actual.rol === 'admin' && datos.rol !== 'admin' && (await Usuario.contarAdmins()) === 1) {
    return { ok: false, estado: 409, error: 'No puedes quitarle el rol al único administrador.' };
  }

  const usuario = await Usuario.actualizarUsuario(id, datos);
  return { ok: true, estado: 200, usuario };
}

// Borra un usuario, pero no deja borrar al único administrador.
export async function eliminarUsuario(id) {
  const usuario = await Usuario.buscarPorId(id);
  if (!usuario) return { ok: false, estado: 404, error: 'El usuario no existe.' };

  if (usuario.rol === 'admin' && (await Usuario.contarAdmins()) === 1) {
    return { ok: false, estado: 409, error: 'No puedes eliminar al único administrador.' };
  }

  try {
    await Usuario.eliminarUsuario(id);
  } catch (error) {
    // La tabla citas no deja borrar a alguien que tiene citas (ON DELETE RESTRICT en schema.sql).
    // PostgreSQL avisa eso con el código '23503'.
    if (error.code === '23503') {
      return { ok: false, estado: 409, error: 'No se puede eliminar: el usuario tiene citas registradas.' };
    }
    throw error;
  }
  return { ok: true, estado: 200 };
}
