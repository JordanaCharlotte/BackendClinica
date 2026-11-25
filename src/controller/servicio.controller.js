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

export async function crearServicio(req, res) {
  try {
    const resultado = await servicioService.crearServicio(req.body);

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.servicio);
  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un servicio con ese código.',
      });
    }

    res.status(500).json({
      error: 'No se pudo crear el servicio.',
    });
  }
}

export async function actualizarServicio(req, res) {
  try {
    const resultado = await servicioService.actualizarServicio(
      Number(req.params.id),
      req.body,
    );

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    res.status(resultado.estado).json(resultado.servicio);
  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un servicio con ese código.',
      });
    }

    res.status(500).json({
      error: 'No se pudo actualizar el servicio.',
    });
  }
}

export async function eliminarServicio(req, res) {
  try {
    const resultado = await servicioService.eliminarServicio(
      Number(req.params.id),
    );

    if (!resultado.ok) {
      return res.status(resultado.estado).json({
        error: resultado.error,
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    if (error.code === '23503') {
      return res.status(409).json({
        error: 'No se puede eliminar el servicio porque tiene citas asociadas.',
      });
    }

    res.status(500).json({
      error: 'No se pudo eliminar el servicio.',
    });
  }
}
