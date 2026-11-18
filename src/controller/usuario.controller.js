// Recibe las solicitudes del administrador sobre usuarios.
import * as usuarioService from '../service/usuario.service.js';
import { validarUsuario, hayErrores } from '../validator/validaciones.js';

// El id llega como texto en la URL; si no es un número válido, se trata como "no existe".
function leerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function listar(req, res) {
  res.json(await usuarioService.listarUsuarios());
}

export async function actualizar(req, res) {
  const id = leerId(req);
  if (!id) return res.status(404).json({ error: 'El usuario no existe.' });

  const errores = validarUsuario(req.body, { esEdicion: true });
  if (hayErrores(errores)) return res.status(400).json({ errores });

  const resultado = await usuarioService.actualizarUsuario(id, req.body);
  if (!resultado.ok) return res.status(resultado.estado).json({ error: resultado.error, campo: resultado.campo });
  res.json(resultado.usuario);
}

export async function eliminar(req, res) {
  const id = leerId(req);
  if (!id) return res.status(404).json({ error: 'El usuario no existe.' });

  const resultado = await usuarioService.eliminarUsuario(id);
  if (!resultado.ok) return res.status(resultado.estado).json({ error: resultado.error });
  res.json({ ok: true });
}
