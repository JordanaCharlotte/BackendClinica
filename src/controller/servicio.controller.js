import * as servicioService from '../service/servicio.service.js';

export async function obtenerServicios(req, res) {
  try {
    const resultado = await servicioService.obtenerServicios();

    res.status(resultado.estado).json(resultado.servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudieron obtener los servicios.',
    });
  }
}

export async function obtenerServicio(req, res) {
  try {
    const resultado = await servicioService.obtenerServicio(
      Number(req.params.id),
    );

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo obtener el servicio.',
    });
  }
}
