// Lógica de registro, login y usuario autenticado.
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Usuario from '../repository/usuario.repository.js';
import { formatearRun } from '../validator/validaciones.js';

// Limpia los datos antes de guardar, igual que en el frontend.
function normalizar(datos) {
  return {
    run: formatearRun(datos.run ?? ''),
    nombre: String(datos.nombre ?? '').trim(),
    apellidos: String(datos.apellidos ?? '').trim(),
    correo: String(datos.correo ?? '').trim().toLowerCase(),
    telefono: String(datos.telefono ?? '').replace(/\s/g, ''),
  };
}

// El token lleva solo el id y el rol.
function crearToken(usuario) {
  return jwt.sign({ sub: String(usuario.id), rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
}

// Registro público: siempre crea clientes.
export async function registrarUsuario(datos) {
  const nuevo = normalizar(datos);
  if (await Usuario.existeCorreo(nuevo.correo)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo.', campo: 'correo' };
  }
  if (await Usuario.existeRun(nuevo.run)) {
    return { ok: false, error: 'Ya existe una cuenta con ese RUN.', campo: 'run' };
  }
  const passwordHash = await bcrypt.hash(datos.password, 10);
  const usuario = await Usuario.crearUsuario({ ...nuevo, passwordHash, rol: 'cliente' });
  return { ok: true, usuario, token: crearToken(usuario) };
}

// Mismo mensaje si el correo no existe o la contraseña es incorrecta.
export async function iniciarSesion(correo, password) {
  const buscado = String(correo ?? '').trim().toLowerCase();
  const usuario = await Usuario.buscarPorCorreo(buscado);
  if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' };
  }
  const { password_hash: _omitida, ...sinPassword } = usuario;
  return { ok: true, usuario: sinPassword, token: crearToken(sinPassword) };
}

export async function obtenerUsuarioActual(id) {
  return Usuario.buscarPorId(id);
}
