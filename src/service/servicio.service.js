import * as Servicio from '../repository/servicio.repository.js';

export async function obtenerServicios() {
  const servicios = await Servicio.buscarTodosLosServicios();

  return {
    ok: true,
    estado: 200,
    servicios,
  };
}

export async function obtenerServicio(id) {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      ok: false,
      estado: 400,
      error: 'El identificador del servicio no es válido.',
    };
  }

  const servicio = await Servicio.buscarServicioPorId(id);

  if (!servicio) {
    return {
      ok: false,
      estado: 404,
      error: 'El servicio no existe.',
    };
  }
  return {
    ok: true,
    estado: 200,
    servicio,
  };
}
