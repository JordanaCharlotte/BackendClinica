// Recibe la solicitud, valida los datos y responde.
import * as authService from '../service/auth.service.js';
import { validarLogin, validarRegistro, hayErrores } from '../validator/validaciones.js';

export async function registro(req, res) {
  const errores = validarRegistro(req.body);
  if (hayErrores(errores)) return res.status(400).json({ errores });

  const resultado = await authService.registrarUsuario(req.body);
  if (!resultado.ok) return res.status(409).json(resultado);
  res.status(201).json(resultado);
}

export async function login(req, res) {
  const errores = validarLogin(req.body);
  if (hayErrores(errores)) return res.status(400).json({ errores });

  const resultado = await authService.iniciarSesion(req.body.correo, req.body.password);
  if (!resultado.ok) return res.status(401).json(resultado);
  res.json(resultado);
}

export async function usuarioActual(req, res) {
  const usuario = await authService.obtenerUsuarioActual(req.usuario.id);
  if (!usuario) return res.status(404).json({ error: 'El usuario no existe.' });
  res.json(usuario);
}
